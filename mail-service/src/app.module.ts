import { Module } from '@nestjs/common';
import { ProjectConfigModule } from './shared/config/config.module';
import { AppController } from './app.controller';
import { MailModule } from './modules/mail/mail.module';
@Module({
  imports: [
    // TypeOrmModule.forRoot(),
    ProjectConfigModule,
    MailModule,
  ],
  controllers: [AppController],
})
export class AppModule { }
