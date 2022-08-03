import { Controller, Post, Body, Res, Get, UseFilters, UseInterceptors, OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc, GrpcMethod, MessagePattern } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Auth } from 'src/common/decorators/auth.decorator';
import { RPCExceptionFilter } from 'src/common/filters/rpc-exception.filter';
import { TransformInterceptorRPC } from 'src/common/interceptors/rpc.interceptor';
import { UserType } from 'src/enums/user.enum';
import { AuthGrpcService } from 'src/generates/configGrpc/grpc.interface';
import { ErrorHelper } from 'src/helpers/error.utils';
import { IRPCResponse } from 'src/interfaces/response.interface'
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController implements OnModuleInit {
  private authGrpcService: AuthGrpcService
  constructor(
    @Inject('AUTH_PACKAGE') private readonly authClient: ClientGrpc,
  ) { }

  onModuleInit() {
    this.authGrpcService = this.authClient.getService<AuthGrpcService>('AuthService')
  }

  @Post('login')
  @Auth([UserType.PUBLIC])
  async login(@Body() payload: LoginDto) { 
    const loginData = await firstValueFrom<IRPCResponse<LoginDto>>(this.authGrpcService.login(payload))
    if(!loginData.success) {
      ErrorHelper.BadRequestException(loginData.message)
    }
    return { ...loginData.data, message: 'Login successfully' }
  }

  @Post('register')
  @Auth([UserType.PUBLIC])
  async register(@Body() payload: RegisterDto) {
    const registerData = await firstValueFrom<IRPCResponse<RegisterDto>>(this.authGrpcService.register(payload))
    if(!registerData.success) {
      ErrorHelper.BadRequestException(registerData.message)
    }
    return registerData.data
  }

}
