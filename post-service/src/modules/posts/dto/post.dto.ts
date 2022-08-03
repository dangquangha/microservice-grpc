import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string

  @IsString()
  content: string

  @IsOptional()
  user_id: number
}

export class UpdatePostDto extends CreatePostDto { }