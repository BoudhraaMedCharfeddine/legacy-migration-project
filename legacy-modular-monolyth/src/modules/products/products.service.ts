import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { ProductCreatedEvent, ProductDeletedEvent, ProductUpdatedEvent } from './events/product.events';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productsRepository.find({ relations: ['user', 'category'] });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['user', 'category'],
    });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      user: dto.user_id ? ({ id: dto.user_id } as User) : null,
      category: dto.category_id ? ({ id: dto.category_id } as Category) : null,
    });
    const saved = await this.productsRepository.save(product);
    this.eventEmitter.emit(ProductCreatedEvent.NAME, new ProductCreatedEvent(saved.id, saved.name, saved.price));
    return saved;
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    if (dto.name !== undefined) product.name = dto.name;
    if (dto.description !== undefined) product.description = dto.description;
    if (dto.price !== undefined) product.price = dto.price;
    if (dto.user_id !== undefined) product.user = dto.user_id ? ({ id: dto.user_id } as User) : null;
    if (dto.category_id !== undefined) product.category = dto.category_id ? ({ id: dto.category_id } as Category) : null;

    const updated = await this.productsRepository.save(product);
    this.eventEmitter.emit(ProductUpdatedEvent.NAME, new ProductUpdatedEvent(updated.id, updated.name, updated.price));
    return updated;
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
    this.eventEmitter.emit(ProductDeletedEvent.NAME, new ProductDeletedEvent(id));
  }
}
