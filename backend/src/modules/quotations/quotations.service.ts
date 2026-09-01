import { Injectable, NotFoundException } from '@nestjs/common';
import { QuotationStatus } from '../../common/enums';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CounterService } from '../../common/prisma/counter.service';
import { DOC_PREFIX } from '../../common/utils/document-number.util';
import { CreateQuotationDto, QuotationItemDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';

function computeItems(items: QuotationItemDto[], taxRate = 0) {
  let subtotal = 0;
  const rows = items.map((it) => {
    const amount = (it.quantity ?? 0) * (it.unitPrice ?? 0);
    subtotal += amount;
    return {
      description: it.description,
      quantity: it.quantity ?? 0,
      unitPrice: it.unitPrice ?? 0,
      amount,
    };
  });
  const taxTotal = subtotal * (taxRate / 100);
  return { rows, subtotal, taxTotal, total: subtotal + taxTotal };
}

@Injectable()
export class QuotationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly counter: CounterService,
  ) {}

  async create(dto: CreateQuotationDto) {
    const issueDate = dto.issueDate ? new Date(dto.issueDate) : new Date();
    const number = await this.counter.next(DOC_PREFIX.QUOTATION, issueDate);
    const { rows, subtotal, taxTotal, total } = computeItems(dto.items ?? [], dto.taxRate ?? 0);
    return this.prisma.quotation.create({
      data: {
        number,
        clientId: dto.clientId,
        issueDate,
        validUntil: dto.validUntil ? new Date(dto.validUntil) : null,
        currency: dto.currency ?? 'KES',
        status: dto.status ?? QuotationStatus.DRAFT,
        notes: dto.notes,
        terms: dto.terms,
        subtotal,
        taxTotal,
        total,
        items: { create: rows },
      },
      include: { client: true, items: true },
    });
  }

  async findAll(params: { page?: number; limit?: number; search?: string; status?: QuotationStatus }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;
    const where: any = {};
    if (params.status) where.status = params.status;
    if (params.search) {
      where.OR = [
        { number: { contains: params.search } },
        { client: { name: { contains: params.search } } },
      ];
    }
    const [data, total] = await Promise.all([
      this.prisma.quotation.findMany({
        where,
        include: { client: true, items: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.quotation.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const q = await this.prisma.quotation.findUnique({
      where: { id },
      include: { client: true, items: true },
    });
    if (!q) throw new NotFoundException('Quotation not found');
    return q;
  }

  async update(id: string, dto: UpdateQuotationDto) {
    const existing = await this.findOne(id);
    const data: any = {
      clientId: dto.clientId,
      currency: dto.currency,
      status: dto.status,
      notes: dto.notes,
      terms: dto.terms,
    };
    if (dto.issueDate) data.issueDate = new Date(dto.issueDate);
    if (dto.validUntil) data.validUntil = new Date(dto.validUntil);
    if (dto.items) {
      const { rows, subtotal, taxTotal, total } = computeItems(dto.items, dto.taxRate ?? 0);
      data.subtotal = subtotal;
      data.taxTotal = taxTotal;
      data.total = total;
      await this.prisma.quotationItem.deleteMany({ where: { quotationId: id } });
      data.items = { create: rows };
    }
    return this.prisma.quotation.update({
      where: { id },
      data,
      include: { client: true, items: true },
    });
  }

  async updateStatus(id: string, status: QuotationStatus) {
    await this.findOne(id);
    return this.prisma.quotation.update({
      where: { id },
      data: { status },
      include: { client: true, items: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.quotation.delete({ where: { id } });
    return { success: true };
  }
}
