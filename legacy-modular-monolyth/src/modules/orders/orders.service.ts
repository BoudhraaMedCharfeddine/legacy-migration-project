import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from '../users/entities/user.entity';
import { OrderCreatedEvent, OrderDeletedEvent, OrderUpdatedEvent } from './events/order.events';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  findAll(): Promise<Order[]> {
    return this.ordersRepository.find({ relations: ['user', 'payment'] });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['user', 'payment'],
    });
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return order;
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    const order = this.ordersRepository.create({
      total: dto.total,
      status: dto.status ?? 'pending',
      user: dto.user_id ? ({ id: dto.user_id } as User) : null,
    });
    const saved = await this.ordersRepository.save(order);
    this.eventEmitter.emit(OrderCreatedEvent.NAME, new OrderCreatedEvent(saved.id, dto.user_id ?? null, saved.total, saved.status));
    return saved;
  }

  async update(id: number, dto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    if (dto.total !== undefined) order.total = dto.total;
    if (dto.status !== undefined) order.status = dto.status;
    if (dto.user_id !== undefined) order.user = dto.user_id ? ({ id: dto.user_id } as User) : null;

    const updated = await this.ordersRepository.save(order);
    this.eventEmitter.emit(OrderUpdatedEvent.NAME, new OrderUpdatedEvent(updated.id, updated.total, updated.status));
    return updated;
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.ordersRepository.remove(order);
    this.eventEmitter.emit(OrderDeletedEvent.NAME, new OrderDeletedEvent(id));
  }
}
