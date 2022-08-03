import { Controller, Get } from '@nestjs/common';
import { GrpcMethod, MessagePattern } from '@nestjs/microservices';
import { get } from 'lodash';
import { IMailNoti } from 'src/interfaces/mail.interface';
import { MailService } from './mail.service';

@Controller('email')
export class MailController {
  constructor(private readonly mailService: MailService) { }

  @GrpcMethod('MailService', 'SendEmail')
  notificationRegister(payload: IMailNoti) {
    this.mailService.sendEmail(payload)
  }

  @Get('test')
  test() {
    this.mailService.test()
  }
}
