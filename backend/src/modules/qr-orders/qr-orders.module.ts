import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QrCodeEntity } from './entities/qr-code.entity';
import { TableSessionEntity } from './entities/table-session.entity';
import { TableRequestEntity } from './entities/table-request.entity';
import { QrOrdersService } from './qr-orders.service';
import { QrOrdersController } from './qr-orders.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QrCodeEntity,
      TableSessionEntity,
      TableRequestEntity,
    ]),
  ],
  controllers: [QrOrdersController],
  providers: [QrOrdersService],
  exports: [QrOrdersService, TypeOrmModule],
})
export class QrOrdersModule {}
