import { Module } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from './shared/config/config.module';

@Module({
  imports: [AuthModule, ConfigModule],
})
export class AppModule { }
