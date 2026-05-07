import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsController } from './products.controller';
import { PRODUCTS_SERVICE } from '@app/shared';

@Module({
  imports: [
    ClientsModule.registerAsync([{
      name: PRODUCTS_SERVICE,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        transport: Transport.TCP,
        options: {
          host: cfg.get('PRODUCTS_SERVICE_HOST', '127.0.0.1'),
          port: cfg.get<number>('PRODUCTS_SERVICE_PORT', 3003),
        },
      }),
    }]),
  ],
  controllers: [ProductsController],
})
export class ProductsModule {}
