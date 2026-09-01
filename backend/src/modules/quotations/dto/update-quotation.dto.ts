import { PartialType } from '@nestjs/mapped-types';
import { IsEnum } from 'class-validator';
import { QuotationStatus } from '../../../common/enums';
import { CreateQuotationDto } from './create-quotation.dto';

export class UpdateQuotationDto extends PartialType(CreateQuotationDto) {}

export class UpdateStatusDto {
  @IsEnum(QuotationStatus)
  status: QuotationStatus;
}
