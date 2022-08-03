import { Module } from '@nestjs/common';

import { ProjectConfigModule } from './shared/config/config.module';
import { UsersModule } from './modules/users/users.module';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './modules/database/database.module'
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { grpcAuthClientOptions } from './generates/configGrpc/grpc-client.options';
@Module({
  imports: [
    // TypeOrmModule.forRoot(),
    DatabaseModule,
    ProjectConfigModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: []
})
export class AppModule { }
