import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PerformanceMonitorInterceptor } from './Interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),)
  const port = process.env.PORT || 4000;
  app.useGlobalInterceptors(new PerformanceMonitorInterceptor())
  await app.listen(port, () => {
    console.log(`Application is running on port : ${port}`);
  });
}
bootstrap();
