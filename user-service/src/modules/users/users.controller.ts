import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { RPCExceptionFilter } from 'src/common/filters/rpc-exception.filter';
import { AUTH_MESSAGE } from '../../messages/error.message';
import { TransformInterceptorRPC } from 'src/common/interceptors/rpc.interceptor';
import { CreateUserDto } from './dto/user.dto';

@Controller('users')

export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // @UseInterceptors(new TransformInterceptorRPC())
  @GrpcMethod('UserService', 'FindByEmail')
  @UseFilters(new RPCExceptionFilter())
  async getUserByEmail(data: { email: string }) {
    const result = await this.usersService.findOne({ email: data.email })
    if (!result) {
      throw new RpcException(AUTH_MESSAGE.EMAIL_NOT_EXIST)
    }
    return result
  }

  // @UseInterceptors(new TransformInterceptorRPC())
  @GrpcMethod('UserService', 'FindById')
  @UseFilters(new RPCExceptionFilter())
  async getUserById(data: { id: number }) {
    const result = await this.usersService.findById(data.id)
    if (!result) {
      throw new RpcException(AUTH_MESSAGE.EMAIL_NOT_EXIST)
    }
    return result
  }

  // @UseInterceptors(new TransformInterceptorRPC())
  @GrpcMethod('UserService', 'Create')
  @UseFilters(new RPCExceptionFilter())
  async createUser(data: CreateUserDto) {
    const result = await this.usersService.createUser(data)
    return result
  }
}
