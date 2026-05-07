import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Payment } from './entities/payment.entity';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ORDERS_SERVICE } from '@app/shared';

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
    // TCP client to emit payment.created events to orders-service
    ClientsModule.registerAsync([{
      name: ORDERS_SERVICE,
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
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class AppModule {}
