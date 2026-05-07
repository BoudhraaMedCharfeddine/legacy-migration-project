import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePaymentDto {
  @IsNotEmpty() @IsNumber() @Type(() => Number)
  order_id: number;

  @IsNotEmpty() @IsString()
  amount: string;

  @IsNotEmpty() @IsString() @MaxLength(50)
  method: string;

  @IsOptional() @IsString() @MaxLength(50)
  status?: string;
}
