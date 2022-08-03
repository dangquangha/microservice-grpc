import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModuleRoot } from '@nestjs/config';
import dev from 'src/configuration/dev';
import { envSchema } from 'src/utils';

import { ProjectConfigService } from './config.service';

const NestConfigModule = NestConfigModuleRoot.forRoot({
  load: [dev],
  isGlobal: true,
  //ignoreEnvFile: true,
  validationSchema: envSchema,
});

@Global()
@Module({
  imports: [NestConfigModule],
  providers: [ProjectConfigService],
  exports: [ProjectConfigService],
})
export class ProjectConfigModule { }
