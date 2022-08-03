import { BadGatewayException, Injectable } from '@nestjs/common';
import { ErrorHelper } from 'src/helpers/error.utils';
import { FindConditions } from 'typeorm';
import { User } from '../entities/user.entity';
import { UsersRepository } from './user.repository';
import { AUTH_MESSAGE } from '../../messages/error.message';
import { IUser } from 'src/interfaces/user.interface';
import { pbkdf2 } from 'src/helpers/encrypt.helper';
import { RpcException } from '@nestjs/microservices';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository
  ) {

  }
  async findOne(payload: FindConditions<User>) {
    const user = await this.userRepository.findOneRaw(payload)
    return user
  }

  async findById(id: number) {
    const user = await this.userRepository.findById(id);
    return user
  }

  async createUser(payload: CreateUserDto) {
    const user = await this.findOne({ email: payload.email })

    if (user) {
      throw new RpcException(AUTH_MESSAGE.EMAIL_EXIST)
    }

    const newUser = {
      email: payload.email,
      password: await pbkdf2(payload.password),
      full_name: payload.full_name
    }
    return await this.userRepository.create(newUser)
  }
}
