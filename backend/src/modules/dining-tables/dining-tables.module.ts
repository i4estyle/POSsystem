import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiningTableEntity } from './entities/dining-table.entity';
import { DiningTablesService } from './dining-tables.service';
import { DiningTablesController } from './dining-tables.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DiningTableEntity])],
  controllers: [DiningTablesController],
  providers: [DiningTablesService],
  exports: [DiningTablesService, TypeOrmModule],
})
export class DiningTablesModule {}
