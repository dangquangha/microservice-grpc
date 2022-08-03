import { MailerService } from "@nestjs-modules/mailer";
import { OnQueueCompleted, OnQueueError, OnQueueFailed, Process, Processor } from "@nestjs/bull";
import { ConfigService } from '@nestjs/config';
import { Job } from "bull";
import { throwError } from "rxjs";

@Processor('email-queue')
export class TaskProcessor {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) { }
  @Process()
  async senderHandler(job: Job) {

    console.log(`Job id ${job.id} start sending...`);

    const { subject, content, to } = job.data;
    const options = {
      from: this.configService.get('mail_reply_username'),
      to,
      subject,
      html: `
        <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
        <h2 style="text-align: center; text-transform: uppercase;color: teal;">Hello,</h2>
        <p>${content}
        </p>    
        </div>
      `,
    }
    await this.mailerService.sendMail(options)
  }
  @OnQueueCompleted()
  CompleteJob(job: Job) {
    console.log(`Job id ${job.id} send completed...`);
  }
  @OnQueueFailed()
  handler(job: Job, error: Error) {
    job.data = {id: 2, email: job.data.email}
    console.log(job.data.id, 'fired exception');
  }

  @Process('send')
  send(job: Job, done: () => void) {
    // if (!job.data.id)
    //   throw new Error("Foo bar")
    setTimeout(() => {
      done()
    }, 3000);
    // done()
  }
  @Process('test')
  test(job: Job, done: () => void) {
    setTimeout(() => {
      done()
    }, 3000);
    // done()
  }
}