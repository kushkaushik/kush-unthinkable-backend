import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv'

dotenv.config()
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin : '*',
    methods : 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue : false,
    optionsSuccessStatus : 204,
    credentials : true
  });

  await app.listen(process.env.PORT);
}
bootstrap();
