import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentsController } from './payments.controller';
import { PAYMENTS_SERVICE } from '@app/shared';

@Module({
  imports: [
    ClientsModule.registerAsync([{
      name: PAYMENTS_SERVICE,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        transport: Transport.TCP,
        options: {
          host: cfg.get('PAYMENTS_SERVICE_HOST', '127.0.0.1'),
          port: cfg.get<number>('PAYMENTS_SERVICE_PORT', 3005),
        },
      }),
    }]),
  ],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
