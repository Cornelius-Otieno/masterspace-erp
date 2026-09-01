import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from './common/prisma/prisma.service';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { Public } from './common/decorators/public.decorator';

function groupTotalsByCurrency(records: { currency: string; total: number }[]) {
  return records.reduce<Record<string, number>>((totals, record) => {
    const currency = record.currency || 'KES';
    totals[currency] = (totals[currency] ?? 0) + record.total;
    return totals;
  }, {});
}

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
      this.prisma.invoice.findMany({ select: { currency: true, total: true } }),
      this.prisma.purchaseOrder.findMany({ select: { currency: true, total: true } }),
      this.prisma.quotation.findMany({ select: { currency: true, total: true } }),
      this.prisma.deliveryNote.count(),
      this.prisma.receipt.findMany({ select: { currency: true, total: true } }),
      this.prisma.workOrder.count(),
      this.prisma.client.count(),
      this.prisma.supplier.count(),
    ]);

    return {
      invoices: { count: invoices.length, totalsByCurrency: groupTotalsByCurrency(invoices) },
      purchaseOrders: {
        count: purchaseOrders.length,
        totalsByCurrency: groupTotalsByCurrency(purchaseOrders),
      },
      quotations: {
        count: quotations.length,
        totalsByCurrency: groupTotalsByCurrency(quotations),
      },
      deliveryNotes: { count: deliveryNotes, total: 0 },
      receipts: { count: receipts.length, totalsByCurrency: groupTotalsByCurrency(receipts) },
      workOrders: { count: workOrders, total: 0 },
      clients,
      suppliers,
    };
  }
}
