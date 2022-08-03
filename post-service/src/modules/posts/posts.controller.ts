import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import { UserType } from 'src/enums/user.enum';

import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { ErrorHelper } from 'src/helpers/error.utils';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { TransformInterceptorRPC } from 'src/common/interceptors/rpc.interceptor';
import { RPCExceptionFilter } from 'src/common/filters/rpc-exception.filter';

@Controller('posts')

export class PostsController {
  constructor(
    private readonly postService: PostsService
  ) { }
  
  @GrpcMethod('PostService', 'FindAll')
  // @UseInterceptors(new TransformInterceptorRPC())
  @UseFilters(new RPCExceptionFilter())
  async getListPost() {
    const data = await this.postService.findAll();
    return data
    
  }

  @GrpcMethod('PostService', 'FindById')
  // @UseInterceptors(new TransformInterceptorRPC())
  @UseFilters(new RPCExceptionFilter())
  async findOne(payload: {id: number}) {
    return this.postService.findById(payload.id);
  }

  @GrpcMethod('PostService', 'Create')
  // @UseInterceptors(new TransformInterceptorRPC())
  @UseFilters(new RPCExceptionFilter())
  async createPost(payload: CreatePostDto) {
    return await this.postService.createPost(payload)
  }

  @GrpcMethod('PostService', 'Update')
  // @UseInterceptors(new TransformInterceptorRPC())
  @UseFilters(new RPCExceptionFilter())
  async updatePost(payload: {id: number, data: UpdatePostDto}) {
    const postUpdate = await this.postService.updatePost(payload.id, payload.data);
    return postUpdate;
  }

  @GrpcMethod('PostService', 'Delete')
  // @UseInterceptors(new TransformInterceptorRPC())
  @UseFilters(new RPCExceptionFilter())
  async deletePost(data: { id: number }) {
    const PostDelete = await this.postService.deletePost(data.id);
    if(!PostDelete.affected) {
      throw new RpcException('Post not exist')
    }
    return 'Post removed';
  }
}
