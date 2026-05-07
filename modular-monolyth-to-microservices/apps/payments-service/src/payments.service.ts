import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto, EVT, ORDERS_SERVICE, UpdatePaymentDto } from '@app/shared';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly repo: Repository<Payment>,
    @Inject(ORDERS_SERVICE)
    private readonly ordersClient: ClientProxy,
  ) {}

  findAll(): Promise<Payment[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.repo.findOneBy({ id });
    if (!payment) throw new RpcException({ statusCode: 404, message: `Payment #${id} not found` });
    return payment;
  }

  async create(dto: CreatePaymentDto): Promise<Payment> {
    const payment = await this.repo.save(this.repo.create({
      orderId: dto.order_id,
      amount: dto.amount,
      method: dto.method,
      status: dto.status ?? 'pending',
    }));

    // Fire-and-forget event → orders-service updates its order status
    // To migrate to Kafka/RabbitMQ: replace this.ordersClient with the broker client
    this.ordersClient.emit(EVT.PAYMENT_CREATED, {
      orderId: payment.orderId,
      status: payment.status,
    });

    return payment;
  }

  async update(id: number, dto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.findOne(id);
    if (dto.amount !== undefined) payment.amount = dto.amount;
    if (dto.method !== undefined) payment.method = dto.method;
    if (dto.status !== undefined) payment.status = dto.status;
    if (dto.order_id !== undefined) payment.orderId = dto.order_id;
    return this.repo.save(payment);
  }

  async remove(id: number): Promise<void> {
    await this.repo.remove(await this.findOne(id));
  }
}
