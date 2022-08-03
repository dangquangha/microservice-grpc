import { Controller, Get, Inject, OnModuleInit, Param, ParseIntPipe, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClientGrpc, GrpcMethod, MessagePattern, RpcException } from '@nestjs/microservices';
import { Auth } from 'src/common/decorators/auth.decorator';
import { AuthGuard } from 'src/common/guards/authenticate.guard';
import { UserType } from 'src/enums/user.enum';

import { IUser } from 'src/interfaces/user.interface';
import { RPCExceptionFilter } from 'src/common/filters/rpc-exception.filter';
import { AUTH_MESSAGE } from '../../messages/error.message';
import { TransformInterceptorRPC } from 'src/common/interceptors/rpc.interceptor';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { CreateUserDto } from './dto/user.dto';
import { UserGrpcService } from 'src/generates/configGrpc/grpc.interface';
import { firstValueFrom } from 'rxjs';
import { IRPCResponse } from 'src/interfaces/response.interface';
import { ErrorHelper } from 'src/helpers/error.utils';

@Controller('users')

export class UsersController implements OnModuleInit {
  private userGrpcService: UserGrpcService
  constructor(
    @Inject('USER_PACKAGE') private readonly userClient: ClientGrpc,
  ) { }

  onModuleInit() {
    this.userGrpcService = this.userClient.getService<UserGrpcService>('UserService')
  }

  @Get(':id')
  @Auth([UserType.PUBLIC])
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const userResponse = await firstValueFrom<IRPCResponse<IUser>>(this.userGrpcService.findById({ id }))
    if(!userResponse.success) {
      ErrorHelper.BadRequestException(userResponse.message)
    }
    return userResponse.data
  }
}
