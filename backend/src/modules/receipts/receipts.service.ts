import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ReceiptStatus } from '../../common/enums';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CounterService } from '../../common/prisma/counter.service';
import { DOC_PREFIX } from '../../common/utils/document-number.util';
import { CreateReceiptDto, ReceiptItemDto } from './dto/create-receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';

function computeItems(items: ReceiptItemDto[]) {
  let subtotal = 0;
  const rows = items.map((it) => {
    subtotal += it.amount ?? 0;
    return {
      description: it.description,
      milestone: it.milestone,
      amount: it.amount ?? 0,
    };
  });
  return { rows, subtotal, total: subtotal };
}

@Injectable()
export class ReceiptsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly counter: CounterService,
  ) {}

  async create(dto: CreateReceiptDto) {
    const issueDate = dto.issueDate ? new Date(dto.issueDate) : new Date();
    const manualNumber = dto.number?.trim();
    if (manualNumber && await this.prisma.receipt.findUnique({ where: { number: manualNumber } })) {
      throw new BadRequestException('A receipt with this number already exists.');
    }
    const number = manualNumber || await this.counter.next(DOC_PREFIX.RECEIPT, issueDate);
    const { rows, subtotal, total } = computeItems(dto.items ?? []);
    return this.prisma.receipt.create({
      data: {
        number,
        clientId: dto.clientId,
        invoiceId: dto.invoiceId || null,
        contractNo: dto.contractNo,
        issueDate,
        currency: dto.currency ?? 'KES',
        status: dto.status ?? ReceiptStatus.PAID,
        paymentMethod: dto.paymentMethod,
        paymentRef: dto.paymentRef,
        notes: dto.notes,
        preparedBy: dto.preparedBy,
        approvedBy: dto.approvedBy,
        subtotal,
        total,
        items: { create: rows },
      },
      include: { client: true, items: true, invoice: true },
    });
  }

  async findAll(params: { page?: number; limit?: number; search?: string; status?: ReceiptStatus }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;
    const where: any = {};
    if (params.status) where.status = params.status;
    if (params.search) {
      where.OR = [
        { number: { contains: params.search } },
        { contractNo: { contains: params.search } },
        { client: { name: { contains: params.search } } },
      ];
    }
    const [data, total] = await Promise.all([
      this.prisma.receipt.findMany({
        where,
        include: { client: true, items: true, invoice: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.receipt.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const r = await this.prisma.receipt.findUnique({
      where: { id },
      include: { client: true, items: true, invoice: true },
    });
    if (!r) throw new NotFoundException('Receipt not found');
    return r;
  }

  async update(id: string, dto: UpdateReceiptDto) {
    await this.findOne(id);
    const data: any = {
      clientId: dto.clientId,
      invoiceId: dto.invoiceId,
      contractNo: dto.contractNo,
      currency: dto.currency,
      status: dto.status,
      paymentMethod: dto.paymentMethod,
      paymentRef: dto.paymentRef,
      notes: dto.notes,
      preparedBy: dto.preparedBy,
      approvedBy: dto.approvedBy,
    };
    if (dto.issueDate) data.issueDate = new Date(dto.issueDate);
    if (dto.items) {
      const { rows, subtotal, total } = computeItems(dto.items);
      data.subtotal = subtotal;
      data.total = total;
      await this.prisma.receiptItem.deleteMany({ where: { receiptId: id } });
      data.items = { create: rows };
    }
    return this.prisma.receipt.update({
      where: { id },
      data,
      include: { client: true, items: true, invoice: true },
    });
  }

  async updateStatus(id: string, status: ReceiptStatus) {
    await this.findOne(id);
    return this.prisma.receipt.update({
      where: { id },
      data: { status },
      include: { client: true, items: true, invoice: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.receipt.delete({ where: { id } });
    return { success: true };
  }
}
