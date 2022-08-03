import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "./common/guards/authenticate.guard";
import { Auth } from 'src/common/decorators/auth.decorator';
import { UserType } from "./enums/user.enum";

@Controller('test')
// @UseGuards(AuthGuard)
export class AppController {
  constructor() {

  }
}