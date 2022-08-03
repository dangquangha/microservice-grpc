import { Controller, Post, Body, Res, Get, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcMethod, MessagePattern } from '@nestjs/microservices';
import { Response } from 'express';
import { RPCExceptionFilter } from 'src/common/filters/rpc-exception.filter';
import { TransformInterceptorRPC } from 'src/common/interceptors/rpc.interceptor';

import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @GrpcMethod('AuthService', 'Login')
  // @UseInterceptors(new TransformInterceptorRPC())
  @UseFilters(new RPCExceptionFilter())
  async login(payload: LoginDto) {    
    const result = await this.authService.login(payload)

    return result 
  }

  @GrpcMethod('AuthService', 'Register')
  // @UseInterceptors(new TransformInterceptorRPC())
  @UseFilters(new RPCExceptionFilter())
  async register(@Body() payload: RegisterDto) {
    const result = await this.authService.register(payload)
    return result
  }

  @GrpcMethod('AuthService', 'VerifyToken')
  // @UseInterceptors(new TransformInterceptorRPC())
  @UseFilters(new RPCExceptionFilter())
  async verifyToken(token: { accessToken: string }) {
    return await this.authService.verifyToken(token.accessToken)
  }
}
