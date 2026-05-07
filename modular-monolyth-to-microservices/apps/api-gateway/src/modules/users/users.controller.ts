import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Inject, Param, ParseIntPipe, Post, Put,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MSG, USERS_SERVICE, CreateUserDto, UpdateUserDto } from '@app/shared';

@Controller('users')
export class UsersController {
  constructor(@Inject(USERS_SERVICE) private readonly client: ClientProxy) {}

  @Get()
  findAll() {
    return this.client.send(MSG.USERS_FIND_ALL, {});
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateUserDto) {
    return this.client.send(MSG.USERS_CREATE, dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.client.send(MSG.USERS_FIND_ONE, id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.client.send(MSG.USERS_UPDATE, { id, dto });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.client.send(MSG.USERS_DELETE, id);
  }
}
