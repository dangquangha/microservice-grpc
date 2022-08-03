import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { IMailNoti } from 'src/interfaces/mail.interface';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue('email-queue') private taskQueue: Queue,

  ) { }

  sendEmail(payload: IMailNoti) {
    this.taskQueue.add(payload, { removeOnComplete: true })
  }

  test() {
    const data = [{ id: 1, email: '1@gmail.com' }, { email: '2@gmail.com' }, { id: 3, email: '3@gmail.com' }, { id: 4, email: '4@gmail.com' }]
    const data2 = [{ id: 10, email: '10@gmail.com' }, { email: '20@gmail.com' }, { id: 30, email: '30@gmail.com' }, { id: 40, email: '40@gmail.com' }]
    data.forEach((item, index) => {
      this.taskQueue.add('send', item, {
        attempts: 3,
        backoff: 3000
      })
      this.taskQueue.add('test', data2[index])
    })
  }
}
