import { PartialType } from '@nestjs/mapped-types';
import { IsEnum } from 'class-validator';
import { PurchaseOrderStatus } from '../../../common/enums';
import { CreatePurchaseOrderDto } from './create-purchase-order.dto';

export class UpdatePurchaseOrderDto extends PartialType(CreatePurchaseOrderDto) {}

export class UpdateStatusDto {
  @IsEnum(PurchaseOrderStatus)
  status: PurchaseOrderStatus;
}
