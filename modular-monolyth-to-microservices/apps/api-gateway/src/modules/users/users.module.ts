import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersController } from './users.controller';
import { USERS_SERVICE, QUEUES } from '@app/shared';

@Module({
  imports: [
    ClientsModule.registerAsync([{
      name: USERS_SERVICE,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        transport: Transport.RMQ,
        options: {
          urls: [cfg.get<string>('RABBITMQ_URL', 'amqp://localhost:5672')],
          queue: QUEUES.USERS,
          queueOptions: { durable: true },
        },
      }),
    }]),
  ],
  controllers: [UsersController],
})
export class UsersModule {}
