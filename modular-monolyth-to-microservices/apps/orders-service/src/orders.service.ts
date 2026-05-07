import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Order } from './entities/order.entity';
import { CreateOrderDto, UpdateOrderDto } from '@app/shared';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly repo: Repository<Order>,
  ) {}

  findAll(): Promise<Order[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.repo.findOneBy({ id });
    if (!order) throw new RpcException({ statusCode: 404, message: `Order #${id} not found` });
    return order;
  }

  create(dto: CreateOrderDto): Promise<Order> {
    return this.repo.save(this.repo.create({
      total: dto.total,
      status: dto.status ?? 'pending',
      userId: dto.user_id ?? null,
    }));
  }

  async update(id: number, dto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    if (dto.total !== undefined) order.total = dto.total;
    if (dto.status !== undefined) order.status = dto.status;
    if (dto.user_id !== undefined) order.userId = dto.user_id ?? null;
    return this.repo.save(order);
  }

  async remove(id: number): Promise<void> {
    await this.repo.remove(await this.findOne(id));
  }

  // Called when payment.created event arrives from payments-service
  async updateStatusOnPayment(orderId: number, paymentStatus: string): Promise<void> {
    const statusMap: Record<string, string> = {
      completed: 'paid',
      failed: 'payment_failed',
      pending: 'awaiting_payment',
    };
    const newStatus = statusMap[paymentStatus];
    if (newStatus) await this.repo.update(orderId, { status: newStatus });
  }
}
