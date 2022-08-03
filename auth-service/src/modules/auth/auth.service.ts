import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ErrorHelper } from 'src/helpers/error.utils';
import { TokenHelper } from 'src/helpers/token.helper';
import { IGenerateJWT } from 'src/interfaces/auth.interface';
import { ConfigService } from 'src/shared/config/config.service';

import { LoginDto, RegisterDto } from './dto/auth.dto';
import { AUTH_MESSAGE } from '../../messages/error.message';
import { IUser } from 'src/interfaces/user.interface';
import { IRPCResponse } from 'src/interfaces/response.interface';
import { comparePbkdf2 } from 'src/helpers/encrypt.helper';
import { MailGrpcService, UserGrpcService } from 'src/generates/configGrpc/grpc.interface';

@Injectable()
export class AuthService implements OnModuleInit {
  private userGrpcService: UserGrpcService;
  private mailGrpcService: MailGrpcService;
  constructor(
    @Inject('USER_PACKAGE') private readonly userClient: ClientGrpc,
    @Inject('MAIL_PACKAGE') private readonly mailClient: ClientGrpc,
    private configService: ConfigService
  ) { }

  onModuleInit() {
    this.userGrpcService = this.userClient.getService<UserGrpcService>('UserService')
    this.mailGrpcService = this.mailClient.getService<MailGrpcService>('MailService')
  }

  async login(payload: LoginDto) {
    const rpcResponse = await firstValueFrom<IRPCResponse<IUser>>(this.userGrpcService.findByEmail({ email: 'trinhtruong1803@gmail.com' }))
    if (!rpcResponse.success) {
      throw new RpcException(rpcResponse.message)
    }
    if (!(await comparePbkdf2(payload.password, rpcResponse.data.password))) {
      throw new RpcException(AUTH_MESSAGE.WRONG_CREDENTIAL);
    }
    return this._generateToken(rpcResponse.data.id);
  }

  async register(payload: RegisterDto) {
    const rpcResponse = await firstValueFrom<IRPCResponse<IUser>>(this.userGrpcService.create(payload))

    if (!rpcResponse.success) {
      throw new RpcException(rpcResponse.message)
    }
    const sendOptions = {
      subject: 'Register Account',
      content: 'Congratulations, you have successfully registered an account',
      to: payload.email
    }
    firstValueFrom(this.mailGrpcService.sendEmail(sendOptions))
    return this._generateToken(rpcResponse.data.id)
  }

  async verifyUser(id: string) {
    // return await firstValueFrom(this.userClient.send('get_user_by_id', id));
  }

  async verifyToken(accessToken: string) {
    const payload = TokenHelper.verify<IGenerateJWT>(accessToken, this.configService.accessTokenSecret);
    return payload
  }

  private _generateToken(id: string) {
    const payload = {
      id,
    };
    const secret = this.configService.accessTokenSecret;
    const expiresIn = this.configService.accessTokenExpires;
    const { token: accessToken, expires } = TokenHelper.generate(payload, secret, expiresIn);
    const refreshToken = this._generateRefreshToken(id);

    return {
      accessToken,
      expires,
      refreshToken,
    };
  }

  private _generateRefreshToken(id: string) {
    return `refresh-token-${id}`;
  }
}
