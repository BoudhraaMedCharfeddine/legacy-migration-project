import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Payment } from './entities/payment.entity';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ORDERS_SERVICE, QUEUES } from '@app/shared';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'better-sqlite3',
        database: cfg.get('DATABASE_PATH', '../legacy-symfony/var/data.db'),
        entities: [Payment],
        synchronize: false,
        prepareDatabase: (db: any) => db.pragma('journal_mode = WAL'),
      }),
    }),
    TypeOrmModule.forFeature([Payment]),
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
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class AppModule {}
