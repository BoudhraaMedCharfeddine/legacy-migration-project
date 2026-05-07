import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '@app/shared';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.repo.findOneBy({ id });
    if (!user) throw new RpcException({ statusCode: 404, message: `User #${id} not found` });
    return user;
  }

  create(dto: CreateUserDto): Promise<User> {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    return this.repo.save(Object.assign(user, dto));
  }

  async remove(id: number): Promise<void> {
    await this.repo.remove(await this.findOne(id));
  }
}
