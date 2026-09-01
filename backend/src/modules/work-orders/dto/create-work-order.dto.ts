import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { WorkOrderStatus } from '../../../common/enums';

export class WorkOrderTaskDto {
  @IsString()
  task: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @IsNumber()
  estimatedHours?: number;
}

export class CreateWorkOrderDto {
  @IsOptional()
  @IsString()
  number?: string;

  @IsString()
  clientId: string;

  @IsOptional()
  @IsString()
  siteDetails?: string;

  @IsOptional()
  @IsString()
  issueDate?: string;

  @IsOptional()
  @IsString()
  expectedDate?: string;

  @IsOptional()
  @IsEnum(WorkOrderStatus)
  status?: WorkOrderStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  authorizedBy?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkOrderTaskDto)
  tasks: WorkOrderTaskDto[];
}
