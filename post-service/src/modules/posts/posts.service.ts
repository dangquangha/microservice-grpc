import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PostsRepository } from './post.repository';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IRPCResponse } from 'src/interfaces/response.interface';
import { IUser } from 'src/interfaces/user.interface';
import { UserGrpcService } from 'src/generates/configGrpc/grpc.interface';
import { ErrorHelper } from 'src/helpers/error.utils';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { IPost } from 'src/interfaces/post.interface';

@Injectable()
export class PostsService implements OnModuleInit {
  private userGrpcService: UserGrpcService;
  constructor(
    @Inject('USER_PACKAGE') private readonly userClient: ClientGrpc,
    private readonly postRepository: PostsRepository,
  ) {

  }
  onModuleInit() {
    this.userGrpcService = this.userClient.getService<UserGrpcService>('UserService')
  }

  async findById(id: number) {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new RpcException('Post not found')
    }
    const postByUser = await firstValueFrom<IRPCResponse<IUser>>(this.userGrpcService.findById({ id: post.user_id }))
    const result = { ...post, user_id: postByUser.data }
    return result
  }

  async findAll() {
    const posts = await this.postRepository.find({})
    return Promise.all(posts.map(async item => {
      const res = await firstValueFrom<IRPCResponse<IUser>>(this.userGrpcService.findById({ id: item.user_id }));
      return { ...item, user_id: res.data }
    }))
  }

  async createPost(payload: CreatePostDto) {
    return await this.postRepository.create(payload)
  }

  async updatePost(id: number, payload: UpdatePostDto) {
    const postExist = await this.findById(id)
    if(!postExist) {
      throw new RpcException('Post not found')
    }
    await this.postRepository.update(id, payload)
    return await this.findById(id)
  }

  async deletePost(id: number) {
    const postExist = await this.findById(id)
    if(!postExist) {
      throw new RpcException('Post not found')
    }
    return await this.postRepository.removeItem(id);
  }
}
