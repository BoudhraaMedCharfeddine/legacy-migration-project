import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  findAll(): Promise<Payment[]> {
    return this.paymentsRepository.find({ relations: ['order'] });
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: ['order'],
    });
    if (!payment) {
      throw new NotFoundException(`Payment #${id} not found`);
    }
    return payment;
  }

  async create(dto: CreatePaymentDto): Promise<Payment> {
    const order = await this.ordersRepository.findOneBy({ id: dto.order_id });
    if (!order) throw new NotFoundException(`Order #${dto.order_id} not found`);

    const payment = this.paymentsRepository.create({
      amount: dto.amount,
      method: dto.method,
      status: dto.status ?? 'pending',
      order,
    });

    return this.paymentsRepository.save(payment);
  }

  async update(id: number, dto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.findOne(id);

    if (dto.amount !== undefined) payment.amount = dto.amount;
    if (dto.method !== undefined) payment.method = dto.method;
    if (dto.status !== undefined) payment.status = dto.status;

    if (dto.order_id !== undefined) {
      const order = await this.ordersRepository.findOneBy({ id: dto.order_id });
      if (!order) throw new NotFoundException(`Order #${dto.order_id} not found`);
      payment.order = order;
    }

    return this.paymentsRepository.save(payment);
  }

  async remove(id: number): Promise<void> {
    const payment = await this.findOne(id);
    await this.paymentsRepository.remove(payment);
  }
}
