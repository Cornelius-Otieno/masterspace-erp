import { PartialType } from '@nestjs/mapped-types';
import { IsEnum } from 'class-validator';
import { ReceiptStatus } from '../../../common/enums';
import { CreateReceiptDto } from './create-receipt.dto';

export class UpdateReceiptDto extends PartialType(CreateReceiptDto) {}

export class UpdateStatusDto {
  @IsEnum(ReceiptStatus)
  status: ReceiptStatus;
}
