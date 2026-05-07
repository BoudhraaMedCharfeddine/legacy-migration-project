import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { EVT, MSG, CreateOrderDto, UpdateOrderDto } from '@app/shared';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern(MSG.ORDERS_FIND_ALL)
  findAll() { return this.ordersService.findAll(); }

  @MessagePattern(MSG.ORDERS_FIND_ONE)
  findOne(@Payload() id: number) { return this.ordersService.findOne(id); }

  @MessagePattern(MSG.ORDERS_CREATE)
  create(@Payload() dto: CreateOrderDto) { return this.ordersService.create(dto); }

  @MessagePattern(MSG.ORDERS_UPDATE)
  update(@Payload() data: { id: number; dto: UpdateOrderDto }) {
    return this.ordersService.update(data.id, data.dto);
  }

  @MessagePattern(MSG.ORDERS_DELETE)
  remove(@Payload() id: number) { return this.ordersService.remove(id); }

  // Receives fire-and-forget event from payments-service
  @EventPattern(EVT.PAYMENT_CREATED)
  handlePaymentCreated(@Payload() data: { orderId: number; status: string }) {
    return this.ordersService.updateStatusOnPayment(data.orderId, data.status);
  }
}
