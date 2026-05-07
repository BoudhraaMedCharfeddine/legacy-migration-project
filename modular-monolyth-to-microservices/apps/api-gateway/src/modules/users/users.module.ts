import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersController } from './users.controller';
import { USERS_SERVICE } from '@app/shared';

@Module({
  imports: [
    ClientsModule.registerAsync([{
      name: USERS_SERVICE,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        transport: Transport.TCP,
        options: {
          host: cfg.get('USERS_SERVICE_HOST', '127.0.0.1'),
          port: cfg.get<number>('USERS_SERVICE_PORT', 3001),
        },
      }),
    }]),
  ],
  controllers: [UsersController],
})
export class UsersModule {}
