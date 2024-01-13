import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });

import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './utils/filters/HttpException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = parseInt(process.env.PORT || '8080');

  const logger = new Logger();
  app.useLogger(logger);

  // Đăng ký HttpExceptionFilter làm global filter
  // app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(port, () => {
    console.log(`✅ App is running in port ${port}`);
  });
}
bootstrap();
