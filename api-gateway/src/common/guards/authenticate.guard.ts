import { CanActivate, ExecutionContext, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { firstValueFrom } from 'rxjs';
import { SPEC_KEY } from 'src/constants/base.constant';
import { RequestHeadersEnum } from 'src/enums/base.enum';
import { ErrorHelper } from 'src/helpers/error.utils';
import { TokenHelper } from 'src/helpers/token.helper';
import { IAuthPermission, IAuthReflexPermission, IGenerateJWT } from 'src/interfaces/auth.interface';
import { ProjectConfigService } from 'src/shared/config/config.service';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { UserType } from 'src/enums/user.enum';
import { IRPCResponse } from 'src/interfaces/response.interface';
import { IUser } from 'src/interfaces/user.interface';
import { AuthGrpcService, UserGrpcService } from 'src/generates/configGrpc/grpc.interface';

@Injectable()
export class AuthGuard implements CanActivate, OnModuleInit {
  private authGrpcService: AuthGrpcService;
  private userGrpcService: UserGrpcService;
  constructor(
    @Inject('AUTH_PACKAGE') private readonly authClient: ClientGrpc,
    @Inject('USER_PACKAGE') private readonly userClient: ClientGrpc,
    private readonly reflector: Reflector,
    private readonly configService: ProjectConfigService,
  ) { }
  onModuleInit() {
    this.authGrpcService = this.authClient.getService<AuthGrpcService>('AuthService');
    this.userGrpcService = this.userClient.getService<UserGrpcService>('UserService');
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const specs = this.reflector.getAllAndOverride<IAuthReflexPermission>(SPEC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const req = context.switchToHttp().getRequest();
    const authorization = req.headers[RequestHeadersEnum.Authorization] || String(req.cookies.JWT);

    const user = await this.verifyAccessToken(authorization);

    // apply user property to request
    req.user = user;
    const { specs: spec, isOnly } = specs;
    if (!spec) {
      return true;
    }

    const { user_type } = user;
    if (isOnly) {
      return spec.includes[user_type];
    }
    return this.checkPermission(spec, user_type);

  }

  checkPermission(spec: UserType[], rolePermission: UserType): boolean {
    if (!spec || spec.includes(UserType.PUBLIC)) {
      return true;
    }

    return spec.includes(rolePermission);
  }

  async verifyAccessToken(authorization: string) {
    const [bearer, accessToken] = authorization.split(' ');
    if (bearer == 'Bearer' && accessToken != '') {
      const rpcResponse = await firstValueFrom<IRPCResponse<IGenerateJWT>>(this.authGrpcService.verifyToken({ accessToken }))
      if (!rpcResponse.success) {
        ErrorHelper.BadRequestException(rpcResponse.message)
      }

      const rpcResponeUserService = await firstValueFrom<IRPCResponse<IUser>>(this.userGrpcService.findById({ id: parseInt(rpcResponse.data.id) }));

      if (!rpcResponeUserService.success) {
        ErrorHelper.UnauthorizedException('Unauthorized Exception');
      }
      return rpcResponeUserService.data;
    } else {
      return { user_type: UserType.PUBLIC };
    }
  }
}
