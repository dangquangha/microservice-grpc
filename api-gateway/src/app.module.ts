import { Module } from '@nestjs/common';

import { ProjectConfigModule } from './shared/config/config.module';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AuthGuard } from './common/guards/authenticate.guard';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { grpcAuthClientOptions, grpcUserClientOptions } from './generates/configGrpc/grpc-client.options';
@Module({
  imports: [
    ProjectConfigModule,
    AuthModule,
    UsersModule,
    PostsModule,
  ],
  controllers: [AppController],
})
export class AppModule { }
