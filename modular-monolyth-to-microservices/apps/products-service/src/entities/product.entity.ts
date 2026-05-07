import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Cross-service FKs are plain columns — no TypeORM relations across service boundaries
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: string;

  @Column({ name: 'user_id', nullable: true })
  userId: number | null;

  @Column({ name: 'category_id', nullable: true })
  categoryId: number | null;
}
