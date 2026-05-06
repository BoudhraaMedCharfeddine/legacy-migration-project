import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserCreatedEvent, UserDeletedEvent, UserUpdatedEvent } from './events/user.events';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.save(this.usersRepository.create(dto));
    this.eventEmitter.emit(UserCreatedEvent.NAME, new UserCreatedEvent(user.id, user.name, user.email));
    return user;
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, dto);
    const updated = await this.usersRepository.save(user);
    this.eventEmitter.emit(UserUpdatedEvent.NAME, new UserUpdatedEvent(updated.id, updated.name, updated.email));
    return updated;
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
    this.eventEmitter.emit(UserDeletedEvent.NAME, new UserDeletedEvent(id));
  }
}
