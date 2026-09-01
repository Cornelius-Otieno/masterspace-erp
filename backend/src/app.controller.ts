import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from './common/prisma/prisma.service';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get('health')
  health() {
    return { status: 'ok', service: 'masterspace-erp', time: new Date().toISOString() };
  }

  @UseGuards(JwtAuthGuard)
  @Get('dashboard/stats')
  async stats() {
    const [
      invoices,
      purchaseOrders,
      quotations,
      deliveryNotes,
      receipts,
      workOrders,
      clients,
      suppliers,
    ] = await Promise.all([
      this.prisma.invoice.aggregate({ _count: true, _sum: { total: true } }),
      this.prisma.purchaseOrder.aggregate({ _count: true, _sum: { total: true } }),
      this.prisma.quotation.aggregate({ _count: true, _sum: { total: true } }),
      this.prisma.deliveryNote.count(),
      this.prisma.receipt.aggregate({ _count: true, _sum: { total: true } }),
      this.prisma.workOrder.count(),
      this.prisma.client.count(),
      this.prisma.supplier.count(),
    ]);

    return {
      invoices: { count: invoices._count, total: invoices._sum.total ?? 0 },
      purchaseOrders: {
        count: purchaseOrders._count,
        total: purchaseOrders._sum.total ?? 0,
      },
      quotations: {
        count: quotations._count,
        total: quotations._sum.total ?? 0,
      },
      deliveryNotes: { count: deliveryNotes, total: 0 },
      receipts: { count: receipts._count, total: receipts._sum.total ?? 0 },
      workOrders: { count: workOrders, total: 0 },
      clients,
      suppliers,
    };
  }
}
