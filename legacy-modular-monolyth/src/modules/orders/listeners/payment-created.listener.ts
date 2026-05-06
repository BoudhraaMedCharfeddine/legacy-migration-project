import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { PaymentCreatedEvent } from '../../payments/events/payment.events';

@Injectable()
export class PaymentCreatedListener {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  @OnEvent(PaymentCreatedEvent.NAME)
  async handle(event: PaymentCreatedEvent): Promise<void> {
    const statusMap: Record<string, string> = {
      completed: 'paid',
      failed: 'payment_failed',
      pending: 'awaiting_payment',
    };

    const newStatus = statusMap[event.status];
    if (newStatus) {
      await this.ordersRepository.update(event.orderId, { status: newStatus });
    }
  }
}
