import { Body, Controller, Delete, Get, Inject, OnModuleInit, Param, ParseIntPipe, Patch, Post, Req, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClientGrpc, MessagePattern, RpcException } from '@nestjs/microservices';
import { Auth } from 'src/common/decorators/auth.decorator';
import { AuthGuard } from 'src/common/guards/authenticate.guard';
import { UserType } from 'src/enums/user.enum';
import { RPCExceptionFilter } from 'src/common/filters/rpc-exception.filter';
import { AUTH_MESSAGE } from '../../messages/error.message';
import { TransformInterceptorRPC } from 'src/common/interceptors/rpc.interceptor';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { Request } from 'express';
import { ErrorHelper } from 'src/helpers/error.utils';
import { PostGrpcService } from 'src/generates/configGrpc/grpc.interface';
import { firstValueFrom } from 'rxjs';
import { IRPCResponse } from 'src/interfaces/response.interface';
import { IPost } from 'src/interfaces/post.interface';

@Controller('posts')

export class PostsController implements OnModuleInit {
  private postGrpcService: PostGrpcService
  constructor(
    @Inject('POST_PACKAGE') private readonly postClient: ClientGrpc,
  ) { }

  onModuleInit() {
      this.postGrpcService = this.postClient.getService<PostGrpcService>('PostService')
  }

  @Get()
  @Auth([UserType.PUBLIC])
  async getListPost() {
    const listPostResponse = await firstValueFrom<IRPCResponse<IPost>>(this.postGrpcService.findAll({}))
    return listPostResponse.data ? listPostResponse.data : []
  }

  @Get(':id')
  @Auth([UserType.PUBLIC])
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const postResponse = await firstValueFrom<IRPCResponse<IPost>>(this.postGrpcService.findById({ id }))
    if(!postResponse.success) {
      ErrorHelper.BadRequestException(postResponse.message)
    }
    return postResponse.data
  }

  @Post()
  @Auth([UserType.CLIENT])
  async createPost(@Body() payload: CreatePostDto, @Req() req: any) {
    const postResponse = await firstValueFrom<IRPCResponse<IPost>>(this.postGrpcService.create({...payload, user_id: req.user.id}))
    if(!postResponse.success) {
      ErrorHelper.BadRequestException(postResponse.message)
    }
    return postResponse.data
  }

  @Patch(':id')
  @Auth([UserType.CLIENT])
  async updatePost(@Body() payload: UpdatePostDto, @Param('id', ParseIntPipe) id: number) {
    const postResponse = await firstValueFrom<IRPCResponse<IPost>>(this.postGrpcService.update({id, data: payload}))
    if(!postResponse.success) {
      ErrorHelper.BadRequestException(postResponse.message)
    }
    return postResponse.data
  }

  @Delete(':id')
  @Auth([UserType.CLIENT])
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    const postResponse = await firstValueFrom<IRPCResponse<IPost>>(this.postGrpcService.delete({ id }))
    if(!postResponse.success) {
      ErrorHelper.BadRequestException(postResponse.message)
    }
    return postResponse.data
  }
}
