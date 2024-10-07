import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration from './config/configuration';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import accessLogger from './log/accessLogger';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const options = { cors: configuration().app.cors };
  const app = await NestFactory.create(AppModule, options);
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(accessLogger({ level: 'info' }));

  // jsonをパースする際のlimitを設定
  app.use(bodyParser.json({ limit: '50mb' }));
  // urlencodeされたボディをパースする際のlimitを設定
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  await app.listen(configuration().app.port);
}
bootstrap();
