import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryCreatedEvent, CategoryDeletedEvent, CategoryUpdatedEvent } from './events/category.events';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  findAll(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) throw new NotFoundException(`Category #${id} not found`);
    return category;
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const category = await this.categoriesRepository.save(this.categoriesRepository.create(dto));
    this.eventEmitter.emit(CategoryCreatedEvent.NAME, new CategoryCreatedEvent(category.id, category.name));
    return category;
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    Object.assign(category, dto);
    const updated = await this.categoriesRepository.save(category);
    this.eventEmitter.emit(CategoryUpdatedEvent.NAME, new CategoryUpdatedEvent(updated.id, updated.name));
    return updated;
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoriesRepository.remove(category);
    this.eventEmitter.emit(CategoryDeletedEvent.NAME, new CategoryDeletedEvent(id));
  }
}
