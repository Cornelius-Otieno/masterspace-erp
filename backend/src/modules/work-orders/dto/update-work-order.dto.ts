import { PartialType } from '@nestjs/mapped-types';
import { IsEnum } from 'class-validator';
import { WorkOrderStatus } from '../../../common/enums';
import { CreateWorkOrderDto } from './create-work-order.dto';

export class UpdateWorkOrderDto extends PartialType(CreateWorkOrderDto) {}

export class UpdateStatusDto {
  @IsEnum(WorkOrderStatus)
  status: WorkOrderStatus;
}
