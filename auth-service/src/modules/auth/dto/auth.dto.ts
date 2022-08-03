import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsMatchPattern } from 'src/common/validators/IsMatchPattern.validation';
import { PASSWORD_PATTERN } from 'src/constants/base.constant';

export class LoginDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class RegisterDto extends LoginDto {
  @IsString()
  @IsNotEmpty()
  full_name: string
}
