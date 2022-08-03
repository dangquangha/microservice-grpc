import { Global, Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { grpcMailClientOptions, grpcUserClientOptions } from 'src/generates/configGrpc/grpc-client.options';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        ...grpcUserClientOptions
      },
      {
        name: 'MAIL_PACKAGE',
        ...grpcMailClientOptions
      }
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule { }
