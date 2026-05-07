import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Product } from './entities/product.entity';
import { CreateProductDto, UpdateProductDto } from '@app/shared';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.repo.findOneBy({ id });
    if (!product) throw new RpcException({ statusCode: 404, message: `Product #${id} not found` });
    return product;
  }

  create(dto: CreateProductDto): Promise<Product> {
    return this.repo.save(this.repo.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      userId: dto.user_id ?? null,
      categoryId: dto.category_id ?? null,
    }));
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    if (dto.name !== undefined) product.name = dto.name;
    if (dto.description !== undefined) product.description = dto.description;
    if (dto.price !== undefined) product.price = dto.price;
    if (dto.user_id !== undefined) product.userId = dto.user_id ?? null;
    if (dto.category_id !== undefined) product.categoryId = dto.category_id ?? null;
    return this.repo.save(product);
  }

  async remove(id: number): Promise<void> {
    await this.repo.remove(await this.findOne(id));
  }
}
