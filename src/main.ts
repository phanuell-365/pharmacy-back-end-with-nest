import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // set up global prefix for all routes
  app.setGlobalPrefix('api/v1');

  await app.listen(process.env.PORT);
}

(async () => {
  await bootstrap();
})();
