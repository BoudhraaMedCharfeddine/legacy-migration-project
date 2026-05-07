import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoriesService } from './categories.service';
import { MSG, CreateCategoryDto, UpdateCategoryDto } from '@app/shared';

@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @MessagePattern(MSG.CATEGORIES_FIND_ALL)
  findAll() { return this.categoriesService.findAll(); }

  @MessagePattern(MSG.CATEGORIES_FIND_ONE)
  findOne(@Payload() id: number) { return this.categoriesService.findOne(id); }

  @MessagePattern(MSG.CATEGORIES_CREATE)
  create(@Payload() dto: CreateCategoryDto) { return this.categoriesService.create(dto); }

  @MessagePattern(MSG.CATEGORIES_UPDATE)
  update(@Payload() data: { id: number; dto: UpdateCategoryDto }) {
    return this.categoriesService.update(data.id, data.dto);
  }

  @MessagePattern(MSG.CATEGORIES_DELETE)
  remove(@Payload() id: number) { return this.categoriesService.remove(id); }
}
