import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Response } from 'express';
import * as YAML from 'yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

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
  app.use('/api-docs-yaml', (req, res: Response) => {
    res.header('Content-Type', 'application/x-yaml');
    res.send(YAML.stringify(document));
  });

app.enableCors();

  await app.listen(process.env.PORT ?? 3000);

  logger.log('Application is running on: http://localhost:3000');
}
bootstrap();
