import { PartialType } from '@nestjs/mapped-types';
import { IsEnum } from 'class-validator';
import { DeliveryStatus } from '../../../common/enums';
import { CreateDeliveryNoteDto } from './create-delivery-note.dto';

export class UpdateDeliveryNoteDto extends PartialType(CreateDeliveryNoteDto) {}

export class UpdateStatusDto {
  @IsEnum(DeliveryStatus)
  status: DeliveryStatus;
}
