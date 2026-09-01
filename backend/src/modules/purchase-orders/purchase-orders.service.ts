import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PurchaseOrderStatus } from '../../common/enums';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CounterService } from '../../common/prisma/counter.service';
import { DOC_PREFIX } from '../../common/utils/document-number.util';
import { CreatePurchaseOrderDto, POItemDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';

function computeItems(items: POItemDto[]) {
  let subtotal = 0;
  const rows = items.map((it) => {
    const amount = (it.quantity ?? 0) * (it.rate ?? 0);
    subtotal += amount;
    return {
      description: it.description,
      unit: it.unit,
      quantity: it.quantity ?? 0,
      rate: it.rate ?? 0,
      amount,
    };
  });
  return { rows, subtotal, total: subtotal };
}

@Injectable()
export class PurchaseOrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly counter: CounterService,
  ) {}

  async create(dto: CreatePurchaseOrderDto) {
    const issueDate = dto.issueDate ? new Date(dto.issueDate) : new Date();
    const manualNumber = dto.number?.trim();
    if (manualNumber && await this.prisma.purchaseOrder.findUnique({ where: { number: manualNumber } })) {
      throw new BadRequestException('A purchase order with this number already exists.');
    }
    const number = manualNumber || await this.counter.next(DOC_PREFIX.PURCHASE_ORDER, issueDate);
    const { rows, subtotal, total } = computeItems(dto.items ?? []);
    return this.prisma.purchaseOrder.create({
      data: {
        number,
        supplierId: dto.supplierId,
        deliverTo: dto.deliverTo ?? 'Masterspace Solutions HQ',
        issueDate,
        expectedDate: dto.expectedDate ? new Date(dto.expectedDate) : null,
        currency: dto.currency ?? 'KES',
        status: dto.status ?? PurchaseOrderStatus.DRAFT,
        notes: dto.notes,
        preparedBy: dto.preparedBy,
        subtotal,
        total,
        items: { create: rows },
      },
      include: { supplier: true, items: true },
    });
  }

  async findAll(params: { page?: number; limit?: number; search?: string; status?: PurchaseOrderStatus }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;
    const where: any = {};
    if (params.status) where.status = params.status;
    if (params.search) {
      where.OR = [
        { number: { contains: params.search } },
        { supplier: { name: { contains: params.search } } },
      ];
    }
    const [data, total] = await Promise.all([
      this.prisma.purchaseOrder.findMany({
        where,
        include: { supplier: true, items: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.purchaseOrder.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const po = await this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: { supplier: true, items: true },
    });
    if (!po) throw new NotFoundException('Purchase order not found');
    return po;
  }

  async update(id: string, dto: UpdatePurchaseOrderDto) {
    await this.findOne(id);
    const data: any = {
      supplierId: dto.supplierId,
      deliverTo: dto.deliverTo,
      currency: dto.currency,
      status: dto.status,
      notes: dto.notes,
      preparedBy: dto.preparedBy,
    };
    if (dto.issueDate) data.issueDate = new Date(dto.issueDate);
    if (dto.expectedDate) data.expectedDate = new Date(dto.expectedDate);
    if (dto.items) {
      const { rows, subtotal, total } = computeItems(dto.items);
      data.subtotal = subtotal;
      data.total = total;
      await this.prisma.pOItem.deleteMany({ where: { purchaseOrderId: id } });
      data.items = { create: rows };
    }
    return this.prisma.purchaseOrder.update({
      where: { id },
      data,
      include: { supplier: true, items: true },
    });
  }

  async updateStatus(id: string, status: PurchaseOrderStatus) {
    await this.findOne(id);
    return this.prisma.purchaseOrder.update({
      where: { id },
      data: { status },
      include: { supplier: true, items: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.purchaseOrder.delete({ where: { id } });
    return { success: true };
  }
}
