import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalaryEntity } from './entities/salary.entity';
import { SalariesService } from './salaries.service';
import { SalariesController } from './salaries.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SalaryEntity])],
  controllers: [SalariesController],
  providers: [SalariesService],
  exports: [SalariesService, TypeOrmModule],
})
export class SalariesModule {}
