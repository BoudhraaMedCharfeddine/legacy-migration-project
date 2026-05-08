import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrdersController } from './orders.controller';
import { ORDERS_SERVICE, QUEUES } from '@app/shared';

@Module({
  imports: [
    ClientsModule.registerAsync([{
      name: ORDERS_SERVICE,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        transport: Transport.RMQ,
        options: {
          urls: [cfg.get<string>('RABBITMQ_URL', 'amqp://localhost:5672')],
          queue: QUEUES.ORDERS,
          queueOptions: { durable: true },
        },
      }),
    }]),
  ],
  controllers: [OrdersController],
})
export class OrdersModule {}
