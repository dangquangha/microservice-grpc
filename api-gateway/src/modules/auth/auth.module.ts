import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ClientsModule } from '@nestjs/microservices';
import { grpcAuthClientOptions } from 'src/generates/configGrpc/grpc-client.options';
@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_PACKAGE',
        ...grpcAuthClientOptions
      }
    ]),
  ],
  controllers: [AuthController],
  providers: [],
  exports: [],
})
export class AuthModule { }
