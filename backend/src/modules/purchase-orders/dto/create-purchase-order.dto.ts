import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { PurchaseOrderStatus } from '../../../common/enums';

export class POItemDto {
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  rate: number;
}

export class CreatePurchaseOrderDto {
  @IsOptional()
  @IsString()
  number?: string;

  @IsString()
  supplierId: string;

  @IsOptional()
  @IsString()
  deliverTo?: string;

  @IsOptional()
  @IsString()
  issueDate?: string;

  @IsOptional()
  @IsString()
  expectedDate?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsEnum(PurchaseOrderStatus)
  status?: PurchaseOrderStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  taxRate?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  preparedBy?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => POItemDto)
  items: POItemDto[];
}
