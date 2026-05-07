import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePaymentDto {
  @IsOptional() @IsNumber() @Type(() => Number)
  order_id?: number;

  @IsOptional() @IsString()
  amount?: string;

  @IsOptional() @IsString() @MaxLength(50)
  method?: string;

  @IsOptional() @IsString() @MaxLength(50)
  status?: string;
}
