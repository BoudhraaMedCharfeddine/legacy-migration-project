import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto {
  @IsOptional() @IsString() @MaxLength(255)
  name?: string;

  @IsOptional() @IsString()
  description?: string;

  @IsOptional() @IsString()
  price?: string;

  @IsOptional() @IsNumber() @Type(() => Number)
  user_id?: number;

  @IsOptional() @IsNumber() @Type(() => Number)
  category_id?: number;
}
