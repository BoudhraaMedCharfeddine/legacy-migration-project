import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Inject, Param, ParseIntPipe, Post, Put,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MSG, ORDERS_SERVICE, CreateOrderDto, UpdateOrderDto } from '@app/shared';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(ORDERS_SERVICE) private readonly client: ClientProxy) {}

  @Get()
  findAll() { return this.client.send(MSG.ORDERS_FIND_ALL, {}); }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateOrderDto) { return this.client.send(MSG.ORDERS_CREATE, dto); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.client.send(MSG.ORDERS_FIND_ONE, id); }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrderDto) {
    return this.client.send(MSG.ORDERS_UPDATE, { id, dto });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) { return this.client.send(MSG.ORDERS_DELETE, id); }
}
