import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Order } from '../orders/entities/order.entity';
import { PaymentCreatedEvent, PaymentDeletedEvent, PaymentUpdatedEvent } from './events/payment.events';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  findAll(): Promise<Payment[]> {
    return this.paymentsRepository.find({ relations: ['order'] });
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: ['order'],
    });
    if (!payment) throw new NotFoundException(`Payment #${id} not found`);
    return payment;
  }

  async create(dto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentsRepository.create({
      amount: dto.amount,
      method: dto.method,
      status: dto.status ?? 'pending',
      order: { id: dto.order_id } as Order,
    });
    const saved = await this.paymentsRepository.save(payment);
    this.eventEmitter.emit(PaymentCreatedEvent.NAME, new PaymentCreatedEvent(saved.id, dto.order_id, saved.amount, saved.status));
    return saved;
  }

  async update(id: number, dto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.findOne(id);
    if (dto.amount !== undefined) payment.amount = dto.amount;
    if (dto.method !== undefined) payment.method = dto.method;
    if (dto.status !== undefined) payment.status = dto.status;
    if (dto.order_id !== undefined) payment.order = { id: dto.order_id } as Order;

    const updated = await this.paymentsRepository.save(payment);
    this.eventEmitter.emit(PaymentUpdatedEvent.NAME, new PaymentUpdatedEvent(updated.id, dto.order_id ?? payment.order.id, updated.status));
    return updated;
  }

  async remove(id: number): Promise<void> {
    const payment = await this.findOne(id);
    await this.paymentsRepository.remove(payment);
    this.eventEmitter.emit(PaymentDeletedEvent.NAME, new PaymentDeletedEvent(id));
  }
}
