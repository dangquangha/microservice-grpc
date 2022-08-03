import { NestFactory } from '@nestjs/core';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';
import morgan from 'morgan';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { SERVER_PORT } from './environments';
import { Transport } from '@nestjs/microservices';
import { ProjectConfigService } from './shared/config/config.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './common/guards/authenticate.guard';
import { grpcMailClientOptions } from './generates/configGrpc/grpc-client.options';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const projectConfigService = app.get(ProjectConfigService);

  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));

  // global nest setup
  useContainer(app.select(AppModule), { fallbackOnErrors: true }); // refer: https://github.com/typestack/class-validator#using-service-container
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  // Starts listening to shutdown hooks
  app.enableShutdownHooks();

  // config
  app.setGlobalPrefix(projectConfigService.baseUrlPrefix);

  await app.listen(SERVER_PORT);
  console.log(`API-GATEWAY is running on: ${await app.getUrl()}`);
}
bootstrap();