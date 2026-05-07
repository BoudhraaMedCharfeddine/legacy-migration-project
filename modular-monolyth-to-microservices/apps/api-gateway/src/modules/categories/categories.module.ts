import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoriesController } from './categories.controller';
import { CATEGORIES_SERVICE } from '@app/shared';

@Module({
  imports: [
    ClientsModule.registerAsync([{
      name: CATEGORIES_SERVICE,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        transport: Transport.TCP,
        options: {
          host: cfg.get('CATEGORIES_SERVICE_HOST', '127.0.0.1'),
          port: cfg.get<number>('CATEGORIES_SERVICE_PORT', 3002),
        },
      }),
    }]),
  ],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
