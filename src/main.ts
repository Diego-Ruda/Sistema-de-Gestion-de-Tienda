import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { seedEmpleados } from './seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Fast Food API')
    .setDescription('API de stock y ventas')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const dataSource = app.get(DataSource);
  await seedEmpleados(dataSource);

  app.enableCors({
    origin: '*', // para desarrollo, luego especificar tu frontend
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`App listening on port ${port}`);
}
bootstrap();
