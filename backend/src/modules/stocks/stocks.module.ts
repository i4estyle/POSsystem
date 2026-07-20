import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockEntity } from './entities/stock.entity';
import { StockMovementEntity } from './entities/stock-movement.entity';
import { StocksService } from './stocks.service';
import { StocksController } from './stocks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StockEntity, StockMovementEntity])],
  controllers: [StocksController],
  providers: [StocksService],
  exports: [StocksService, TypeOrmModule],
})
export class StocksModule {}
