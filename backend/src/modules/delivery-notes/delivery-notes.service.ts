import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DeliveryStatus } from '../../common/enums';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CounterService } from '../../common/prisma/counter.service';
import { DOC_PREFIX } from '../../common/utils/document-number.util';
import { CreateDeliveryNoteDto, DeliveryItemDto } from './dto/create-delivery-note.dto';
import { UpdateDeliveryNoteDto } from './dto/update-delivery-note.dto';

function mapItems(items: DeliveryItemDto[]) {
  return items.map((it) => ({
    description: it.description,
    quantity: it.quantity ?? 0,
    unit: it.unit,
    remarks: it.remarks,
  }));
}

@Injectable()
export class DeliveryNotesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly counter: CounterService,
  ) {}

  async create(dto: CreateDeliveryNoteDto) {
    const issueDate = dto.issueDate ? new Date(dto.issueDate) : new Date();
    const manualNumber = dto.number?.trim();
    if (manualNumber && await this.prisma.deliveryNote.findUnique({ where: { number: manualNumber } })) {
      throw new BadRequestException('A delivery note with this number already exists.');
    }
    const number = manualNumber || await this.counter.next(DOC_PREFIX.DELIVERY_NOTE, issueDate);
    return this.prisma.deliveryNote.create({
      data: {
        number,
        clientId: dto.clientId,
        issueDate,
        deliveryDate: dto.deliveryDate ? new Date(dto.deliveryDate) : null,
        deliveredBy: dto.deliveredBy,
        status: dto.status ?? DeliveryStatus.DRAFT,
        notes: dto.notes,
        items: { create: mapItems(dto.items ?? []) },
      },
      include: { client: true, items: true },
    });
  }

  async findAll(params: { page?: number; limit?: number; search?: string; status?: DeliveryStatus }) {
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
      this.prisma.deliveryNote.findMany({
        where,
        include: { client: true, items: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.deliveryNote.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const dn = await this.prisma.deliveryNote.findUnique({
      where: { id },
      include: { client: true, items: true },
    });
    if (!dn) throw new NotFoundException('Delivery note not found');
    return dn;
  }

  async update(id: string, dto: UpdateDeliveryNoteDto) {
    await this.findOne(id);
    const data: any = {
      clientId: dto.clientId,
      deliveredBy: dto.deliveredBy,
      status: dto.status,
      notes: dto.notes,
    };
    if (dto.issueDate) data.issueDate = new Date(dto.issueDate);
    if (dto.deliveryDate) data.deliveryDate = new Date(dto.deliveryDate);
    if (dto.items) {
      await this.prisma.deliveryItem.deleteMany({ where: { deliveryNoteId: id } });
      data.items = { create: mapItems(dto.items) };
    }
    return this.prisma.deliveryNote.update({
      where: { id },
      data,
      include: { client: true, items: true },
    });
  }

  async updateStatus(id: string, status: DeliveryStatus) {
    await this.findOne(id);
    return this.prisma.deliveryNote.update({
      where: { id },
      data: { status },
      include: { client: true, items: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.deliveryNote.delete({ where: { id } });
    return { success: true };
  }
}
