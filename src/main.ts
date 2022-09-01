import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.enableCors();

  // set up global prefix for all routes
  app.setGlobalPrefix('/v1/api');

  await app.listen(process.env.PORT);
}

(async () => {
  await bootstrap();
})();
