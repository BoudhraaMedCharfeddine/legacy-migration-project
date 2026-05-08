import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoriesController } from './categories.controller';
import { CATEGORIES_SERVICE, QUEUES } from '@app/shared';

@Module({
  imports: [
    ClientsModule.registerAsync([{
      name: CATEGORIES_SERVICE,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        transport: Transport.RMQ,
        options: {
          urls: [cfg.get<string>('RABBITMQ_URL', 'amqp://localhost:5672')],
          queue: QUEUES.CATEGORIES,
          queueOptions: { durable: true },
        },
      }),
    }]),
  ],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
