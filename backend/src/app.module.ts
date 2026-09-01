import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ClientsModule } from './modules/clients/clients.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { PurchaseOrdersModule } from './modules/purchase-orders/purchase-orders.module';
import { QuotationsModule } from './modules/quotations/quotations.module';
import { DeliveryNotesModule } from './modules/delivery-notes/delivery-notes.module';
import { ReceiptsModule } from './modules/receipts/receipts.module';
import { WorkOrdersModule } from './modules/work-orders/work-orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ClientsModule,
    SuppliersModule,
    InvoicesModule,
    PurchaseOrdersModule,
    QuotationsModule,
    DeliveryNotesModule,
    ReceiptsModule,
    WorkOrdersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
