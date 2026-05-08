import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentsController } from './payments.controller';
import { PAYMENTS_SERVICE, QUEUES } from '@app/shared';

@Module({
  imports: [
    ClientsModule.registerAsync([{
      name: PAYMENTS_SERVICE,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        transport: Transport.RMQ,
        options: {
          urls: [cfg.get<string>('RABBITMQ_URL', 'amqp://localhost:5672')],
          queue: QUEUES.PAYMENTS,
          queueOptions: { durable: true },
        },
      }),
    }]),
  ],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
