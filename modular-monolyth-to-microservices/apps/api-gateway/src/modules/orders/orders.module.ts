import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrdersController } from './orders.controller';
import { ORDERS_SERVICE } from '@app/shared';

@Module({
  imports: [
    ClientsModule.registerAsync([{
      name: ORDERS_SERVICE,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        transport: Transport.TCP,
        options: {
          host: cfg.get('ORDERS_SERVICE_HOST', '127.0.0.1'),
          port: cfg.get<number>('ORDERS_SERVICE_PORT', 3004),
        },
      }),
    }]),
  ],
  controllers: [OrdersController],
})
export class OrdersModule {}
