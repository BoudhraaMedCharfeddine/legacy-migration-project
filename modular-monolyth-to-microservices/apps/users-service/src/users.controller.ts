import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { MSG, CreateUserDto, UpdateUserDto } from '@app/shared';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(MSG.USERS_FIND_ALL)
  findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern(MSG.USERS_FIND_ONE)
  findOne(@Payload() id: number) {
    return this.usersService.findOne(id);
  }

  @MessagePattern(MSG.USERS_CREATE)
  create(@Payload() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @MessagePattern(MSG.USERS_UPDATE)
  update(@Payload() data: { id: number; dto: UpdateUserDto }) {
    return this.usersService.update(data.id, data.dto);
  }

  @MessagePattern(MSG.USERS_DELETE)
  remove(@Payload() id: number) {
    return this.usersService.remove(id);
  }
}
