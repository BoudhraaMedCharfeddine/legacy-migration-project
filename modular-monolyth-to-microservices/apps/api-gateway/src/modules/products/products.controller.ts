import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Inject, Param, ParseIntPipe, Post, Put,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MSG, PRODUCTS_SERVICE, CreateProductDto, UpdateProductDto } from '@app/shared';

@Controller('products')
export class ProductsController {
  constructor(@Inject(PRODUCTS_SERVICE) private readonly client: ClientProxy) {}

  @Get()
  findAll() { return this.client.send(MSG.PRODUCTS_FIND_ALL, {}); }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateProductDto) { return this.client.send(MSG.PRODUCTS_CREATE, dto); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.client.send(MSG.PRODUCTS_FIND_ONE, id); }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.client.send(MSG.PRODUCTS_UPDATE, { id, dto });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) { return this.client.send(MSG.PRODUCTS_DELETE, id); }
}
