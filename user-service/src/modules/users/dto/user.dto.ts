import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';

export class CreateUserDto {

  @IsString()
  full_name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
