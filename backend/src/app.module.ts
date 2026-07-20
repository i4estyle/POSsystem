import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { BranchesModule } from './modules/branches/branches.module';
import { RolesModule } from './modules/roles/roles.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { SalariesModule } from './modules/salaries/salaries.module';
import { CustomersModule } from './modules/customers/customers.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { StocksModule } from './modules/stocks/stocks.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { PromotionsModule } from './modules/promotions/promotions.module';
import { DiningTablesModule } from './modules/dining-tables/dining-tables.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { QrOrdersModule } from './modules/qr-orders/qr-orders.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(process.cwd(), '../.env'),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT') || 3306,
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
        migrationsRun: true,
        migrations: ['dist/database/migrations/*.js'],
      }),
    }),
    AuthModule,
    BranchesModule,
    RolesModule,
    EmployeesModule,
    AttendanceModule,
    SalariesModule,
    CustomersModule,
    CategoriesModule,
    ProductsModule,
    StocksModule,
    SuppliersModule,
    PromotionsModule,
    DiningTablesModule,
    OrdersModule,
    PaymentsModule,
    FeedbackModule,
    QrOrdersModule,
  ],
})
export class AppModule {}
