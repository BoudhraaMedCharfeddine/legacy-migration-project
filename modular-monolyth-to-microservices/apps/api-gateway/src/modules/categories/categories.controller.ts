import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Inject, Param, ParseIntPipe, Post, Put,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MSG, CATEGORIES_SERVICE, CreateCategoryDto, UpdateCategoryDto } from '@app/shared';

@Controller('categories')
export class CategoriesController {
  constructor(@Inject(CATEGORIES_SERVICE) private readonly client: ClientProxy) {}

  @Get()
  findAll() { return this.client.send(MSG.CATEGORIES_FIND_ALL, {}); }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCategoryDto) { return this.client.send(MSG.CATEGORIES_CREATE, dto); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.client.send(MSG.CATEGORIES_FIND_ONE, id); }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
    return this.client.send(MSG.CATEGORIES_UPDATE, { id, dto });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) { return this.client.send(MSG.CATEGORIES_DELETE, id); }
}
