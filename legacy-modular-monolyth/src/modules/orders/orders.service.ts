import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<Order[]> {
    return this.ordersRepository.find({ relations: ['user', 'payment'] });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['user', 'payment'],
    });
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return order;
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    const order = this.ordersRepository.create({
      total: dto.total,
      status: dto.status ?? 'pending',
    });

    if (dto.user_id) {
      const user = await this.usersRepository.findOneBy({ id: dto.user_id });
      if (!user) throw new NotFoundException(`User #${dto.user_id} not found`);
      order.user = user;
    }

    return this.ordersRepository.save(order);
  }

  async update(id: number, dto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);

    if (dto.total !== undefined) order.total = dto.total;
    if (dto.status !== undefined) order.status = dto.status;

    if (dto.user_id !== undefined) {
      if (dto.user_id === null) {
        order.user = null;
      } else {
        const user = await this.usersRepository.findOneBy({ id: dto.user_id });
        if (!user) throw new NotFoundException(`User #${dto.user_id} not found`);
        order.user = user;
      }
    }

    return this.ordersRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.ordersRepository.remove(order);
  }
}
