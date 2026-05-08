import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsController } from './products.controller';
import { PRODUCTS_SERVICE, QUEUES } from '@app/shared';

@Module({
  imports: [
    ClientsModule.registerAsync([{
      name: PRODUCTS_SERVICE,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        transport: Transport.RMQ,
        options: {
          urls: [cfg.get<string>('RABBITMQ_URL', 'amqp://localhost:5672')],
          queue: QUEUES.PRODUCTS,
          queueOptions: { durable: true },
        },
      }),
    }]),
  ],
  controllers: [ProductsController],
})
export class ProductsModule {}
