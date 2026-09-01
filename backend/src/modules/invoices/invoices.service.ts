import { Injectable, NotFoundException } from '@nestjs/common';
import { InvoiceStatus } from '../../common/enums';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CounterService } from '../../common/prisma/counter.service';
import { DOC_PREFIX } from '../../common/utils/document-number.util';
import { numberToWords } from '../../common/utils/number-to-words.util';
import { CreateInvoiceDto, InvoiceItemDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

function computeItems(items: InvoiceItemDto[]) {
  let subtotal = 0;
  let taxTotal = 0;
  const rows = items.map((it) => {
    const amount = (it.quantity ?? 0) * (it.rate ?? 0);
    const taxAmount = amount * ((it.taxRate ?? 0) / 100);
    const total = amount + taxAmount;
    subtotal += amount;
    taxTotal += taxAmount;
    return {
      description: it.description,
      taxRate: it.taxRate ?? 0,
      quantity: it.quantity ?? 0,
      rate: it.rate ?? 0,
      amount,
      taxAmount,
      total,
    };
  });
  return { rows, subtotal, taxTotal, total: subtotal + taxTotal };
}

function currencyWords(currency: string) {
  switch ((currency || 'KES').toUpperCase()) {
    case 'USD':
      return { major: 'DOLLARS', minor: 'CENTS' };
    case 'KES':
      return { major: 'SHILLINGS', minor: 'CENTS' };
    default:
      return { major: currency.toUpperCase(), minor: 'CENTS' };
  }
}

@Injectable()
export class InvoicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly counter: CounterService,
  ) {}

  async create(dto: CreateInvoiceDto) {
    const issueDate = dto.issueDate ? new Date(dto.issueDate) : new Date();
    const number = await this.counter.next(DOC_PREFIX.INVOICE, issueDate);
    const { rows, subtotal, taxTotal, total } = computeItems(dto.items ?? []);
    const words = currencyWords(dto.currency ?? 'KES');
    return this.prisma.invoice.create({
      data: {
        number,
        contractNo: dto.contractNo,
        clientId: dto.clientId,
        issueDate,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        currency: dto.currency ?? 'KES',
        status: dto.status ?? InvoiceStatus.DRAFT,
        notes: dto.notes,
        subtotal,
        taxTotal,
        total,
        totalInWords: numberToWords(total, words.major, words.minor),
        items: { create: rows },
      },
      include: { items: true, client: true },
    });
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: InvoiceStatus;
  }) {
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
    const [data, totalCount] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        include: { client: true, items: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.invoice.count({ where }),
    ]);
    return { data, total: totalCount, page, limit };
  }

  async findOne(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: { client: true, items: true },
    });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async update(id: string, dto: UpdateInvoiceDto) {
    const existing = await this.findOne(id);
    const data: any = {
      contractNo: dto.contractNo,
      clientId: dto.clientId,
      currency: dto.currency,
      status: dto.status,
      notes: dto.notes,
    };
    if (dto.issueDate) data.issueDate = new Date(dto.issueDate);
    if (dto.dueDate) data.dueDate = new Date(dto.dueDate);

    if (dto.items) {
      const { rows, subtotal, taxTotal, total } = computeItems(dto.items);
      const words = currencyWords(dto.currency ?? existing.currency);
      data.subtotal = subtotal;
      data.taxTotal = taxTotal;
      data.total = total;
      data.totalInWords = numberToWords(total, words.major, words.minor);
      // replace items
      await this.prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });
      data.items = { create: rows };
    }

    return this.prisma.invoice.update({
      where: { id },
      data,
      include: { client: true, items: true },
    });
  }

  async updateStatus(id: string, status: InvoiceStatus) {
    await this.findOne(id);
    return this.prisma.invoice.update({
      where: { id },
      data: { status },
      include: { client: true, items: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.invoice.delete({ where: { id } });
    return { success: true };
  }
}
