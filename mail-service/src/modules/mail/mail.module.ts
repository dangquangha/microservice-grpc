import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TaskProcessor } from 'src/tasks/task.processor';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      }
    }),
    BullModule.registerQueue({
      name: 'email-queue',
    }),
    MailerModule.forRootAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_SMTP'),
          port: config.get('MAIL_SMTP_PORT'),
          requireTLS: true,
          auth: {
            user: config.get('MAIL_REPLY_USERNAME'),
            pass: config.get('MAIL_REPLY_PASSWORD')
          },
        }
      })
    }),
  ],
  controllers: [MailController],
  providers: [MailService, TaskProcessor]
})
export class MailModule { }
