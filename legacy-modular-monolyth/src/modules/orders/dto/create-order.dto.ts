import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  user_id?: number;

  @IsNotEmpty()
  @IsString()
  total: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;
}
