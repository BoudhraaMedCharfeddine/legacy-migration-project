import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Category } from './entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '@app/shared';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.repo.findOneBy({ id });
    if (!category) throw new RpcException({ statusCode: 404, message: `Category #${id} not found` });
    return category;
  }

  create(dto: CreateCategoryDto): Promise<Category> {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    return this.repo.save(Object.assign(category, dto));
  }

  async remove(id: number): Promise<void> {
    await this.repo.remove(await this.findOne(id));
  }
}
