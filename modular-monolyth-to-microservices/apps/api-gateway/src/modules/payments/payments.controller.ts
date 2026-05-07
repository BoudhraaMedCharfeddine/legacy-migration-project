import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Inject, Param, ParseIntPipe, Post, Put,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MSG, PAYMENTS_SERVICE, CreatePaymentDto, UpdatePaymentDto } from '@app/shared';

@Controller('payments')
export class PaymentsController {
  constructor(@Inject(PAYMENTS_SERVICE) private readonly client: ClientProxy) {}

  @Get()
  findAll() { return this.client.send(MSG.PAYMENTS_FIND_ALL, {}); }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreatePaymentDto) { return this.client.send(MSG.PAYMENTS_CREATE, dto); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.client.send(MSG.PAYMENTS_FIND_ONE, id); }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePaymentDto) {
    return this.client.send(MSG.PAYMENTS_UPDATE, { id, dto });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) { return this.client.send(MSG.PAYMENTS_DELETE, id); }
}
