import { Module } from '@nestjs/common';

import { PostsController } from './posts.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { grpcAuthClientOptions, grpcPostClientOptions, grpcUserClientOptions } from 'src/generates/configGrpc/grpc-client.options';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/common/guards/authenticate.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
    ]),
    ClientsModule.register([
      {
        name: 'POST_PACKAGE',
        ...grpcPostClientOptions
      },
      {
        name: 'AUTH_PACKAGE',
        ...grpcAuthClientOptions
      },
      {
        name: 'USER_PACKAGE',
        ...grpcUserClientOptions
      },
    ])
  ],
  controllers: [PostsController],
  providers: [{
    provide: APP_GUARD,
    useClass: AuthGuard,
  },],
  exports: [],
})
export class PostsModule { }
