import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productsRepository.find({ relations: ['user', 'category'] });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['user', 'category'],
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
    });

    if (dto.user_id) {
      const user = await this.usersRepository.findOneBy({ id: dto.user_id });
      if (!user) throw new NotFoundException(`User #${dto.user_id} not found`);
      product.user = user;
    }

    if (dto.category_id) {
      const category = await this.categoriesRepository.findOneBy({ id: dto.category_id });
      if (!category) throw new NotFoundException(`Category #${dto.category_id} not found`);
      product.category = category;
    }

    return this.productsRepository.save(product);
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    if (dto.name !== undefined) product.name = dto.name;
    if (dto.description !== undefined) product.description = dto.description;
    if (dto.price !== undefined) product.price = dto.price;

    if (dto.user_id !== undefined) {
      if (dto.user_id === null) {
        product.user = null;
      } else {
        const user = await this.usersRepository.findOneBy({ id: dto.user_id });
        if (!user) throw new NotFoundException(`User #${dto.user_id} not found`);
        product.user = user;
      }
    }

    if (dto.category_id !== undefined) {
      if (dto.category_id === null) {
        product.category = null;
      } else {
        const category = await this.categoriesRepository.findOneBy({ id: dto.category_id });
        if (!category) throw new NotFoundException(`Category #${dto.category_id} not found`);
        product.category = category;
      }
    }

    return this.productsRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }
}
