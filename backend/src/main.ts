// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Simplified CORS for testing
  app.enableCors({
    origin: '*',           // Allow all origins for testing
    methods: '*',          // Allow all methods
    allowedHeaders: '*',   // Allow all headers
    credentials: false,    // Set to false for wildcard origin
  });
  
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    whitelist: true,
    forbidNonWhitelisted: false,
    skipMissingProperties: false,
  }));
  
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
}
bootstrap();