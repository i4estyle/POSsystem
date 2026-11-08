import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QrCodeEntity } from './entities/qr-code.entity';
import { TableSessionEntity } from './entities/table-session.entity';
import { TableRequestEntity } from './entities/table-request.entity';
import { QrOrdersService } from './qr-orders.service';
import { QrOrdersController } from './qr-orders.controller';
import { TunnelService } from './tunnel.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QrCodeEntity,
      TableSessionEntity,
      TableRequestEntity,
    ]),
  ],
  controllers: [QrOrdersController],
  providers: [QrOrdersService, TunnelService],
  exports: [QrOrdersService, TunnelService, TypeOrmModule],
})
export class QrOrdersModule {}
