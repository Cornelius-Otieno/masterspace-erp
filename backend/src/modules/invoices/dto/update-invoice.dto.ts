import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { InvoiceStatus } from '../../../common/enums';
import { CreateInvoiceDto } from './create-invoice.dto';

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {}

export class UpdateStatusDto {
  @IsEnum(InvoiceStatus)
  status: InvoiceStatus;
}
