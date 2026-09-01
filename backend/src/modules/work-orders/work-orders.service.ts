import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkOrderStatus } from '../../common/enums';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CounterService } from '../../common/prisma/counter.service';
import { DOC_PREFIX } from '../../common/utils/document-number.util';
import { CreateWorkOrderDto, WorkOrderTaskDto } from './dto/create-work-order.dto';
import { UpdateWorkOrderDto } from './dto/update-work-order.dto';

function mapTasks(tasks: WorkOrderTaskDto[]) {
  return tasks.map((t) => ({
    task: t.task,
    description: t.description,
    assignedTo: t.assignedTo,
    estimatedHours: t.estimatedHours ?? 0,
  }));
}

@Injectable()
export class WorkOrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly counter: CounterService,
  ) {}

  async create(dto: CreateWorkOrderDto) {
    const issueDate = dto.issueDate ? new Date(dto.issueDate) : new Date();
    const number = await this.counter.next(DOC_PREFIX.WORK_ORDER, issueDate);
    return this.prisma.workOrder.create({
      data: {
        number,
        clientId: dto.clientId,
        siteDetails: dto.siteDetails,
        issueDate,
        expectedDate: dto.expectedDate ? new Date(dto.expectedDate) : null,
        status: dto.status ?? WorkOrderStatus.DRAFT,
        notes: dto.notes,
        authorizedBy: dto.authorizedBy,
        tasks: { create: mapTasks(dto.tasks ?? []) },
      },
      include: { client: true, tasks: true },
    });
  }

  async findAll(params: { page?: number; limit?: number; search?: string; status?: WorkOrderStatus }) {
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
      this.prisma.workOrder.findMany({
        where,
        include: { client: true, tasks: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.workOrder.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const wo = await this.prisma.workOrder.findUnique({
      where: { id },
      include: { client: true, tasks: true },
    });
    if (!wo) throw new NotFoundException('Work order not found');
    return wo;
  }

  async update(id: string, dto: UpdateWorkOrderDto) {
    await this.findOne(id);
    const data: any = {
      clientId: dto.clientId,
      siteDetails: dto.siteDetails,
      status: dto.status,
      notes: dto.notes,
      authorizedBy: dto.authorizedBy,
    };
    if (dto.issueDate) data.issueDate = new Date(dto.issueDate);
    if (dto.expectedDate) data.expectedDate = new Date(dto.expectedDate);
    if (dto.tasks) {
      await this.prisma.workOrderTask.deleteMany({ where: { workOrderId: id } });
      data.tasks = { create: mapTasks(dto.tasks) };
    }
    return this.prisma.workOrder.update({
      where: { id },
      data,
      include: { client: true, tasks: true },
    });
  }

  async updateStatus(id: string, status: WorkOrderStatus) {
    await this.findOne(id);
    return this.prisma.workOrder.update({
      where: { id },
      data: { status },
      include: { client: true, tasks: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.workOrder.delete({ where: { id } });
    return { success: true };
  }
}
