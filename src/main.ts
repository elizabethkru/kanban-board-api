import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.setGlobalPrefix('api');

    const config = new DocumentBuilder()
    .setTitle('Kanban Board API')
    .setDescription('API для управления канбан-досками (Trello-клон)')
    .setVersion('1.0')
    .addBearerAuth() // добавляем поддержку JWT в Swagger
    .build();

    const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // документация будет доступна по /api-docs
  
    
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
