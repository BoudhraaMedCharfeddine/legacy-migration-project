import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { MSG, CreateProductDto, UpdateProductDto } from '@app/shared';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern(MSG.PRODUCTS_FIND_ALL)
  findAll() { return this.productsService.findAll(); }

  @MessagePattern(MSG.PRODUCTS_FIND_ONE)
  findOne(@Payload() id: number) { return this.productsService.findOne(id); }

  @MessagePattern(MSG.PRODUCTS_CREATE)
  create(@Payload() dto: CreateProductDto) { return this.productsService.create(dto); }

  @MessagePattern(MSG.PRODUCTS_UPDATE)
  update(@Payload() data: { id: number; dto: UpdateProductDto }) {
    return this.productsService.update(data.id, data.dto);
  }

  @MessagePattern(MSG.PRODUCTS_DELETE)
  remove(@Payload() id: number) { return this.productsService.remove(id); }
}
