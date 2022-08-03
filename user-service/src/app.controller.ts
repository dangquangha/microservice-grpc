import { Controller, Get, UseGuards } from "@nestjs/common";
import { Auth } from 'src/common/decorators/auth.decorator';
import { UserType } from "./enums/user.enum";

@Controller('test')
export class AppController {
  constructor() {

  }
}