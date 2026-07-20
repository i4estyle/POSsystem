import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

import { json, urlencoded } from 'express';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: true }));
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('POS & QR Order System API')
    .setDescription('Enterprise Point of Sale & QR Order API documentation')
    .setVersion('1.0')
    .addTag('Branches')
    .addTag('Roles')
    .addTag('Employees')
    .addTag('Attendance')
    .addTag('Salaries')
    .addTag('Customers')
    .addTag('Categories')
    .addTag('Products')
    .addTag('Stocks')
    .addTag('Suppliers')
    .addTag('Promotions')
    .addTag('Dining Tables')
    .addTag('Orders')
    .addTag('Payments')
    .addTag('Feedback')
    .addTag('QR Orders')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  await app.listen(port);
}

bootstrap().catch((err: unknown) => {
  console.error(err);
});
