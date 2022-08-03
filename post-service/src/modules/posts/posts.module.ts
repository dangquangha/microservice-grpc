import { Module } from '@nestjs/common';

import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { PostsRepository } from './post.repository';
import { grpcPostClientOptions, grpcUserClientOptions } from 'src/generates/configGrpc/grpc-client.options';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
    ]),
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        ...grpcUserClientOptions
      }
    ]),

  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
  exports: [PostsService],
})
export class PostsModule { }
