import { Module } from '@nestjs/common';

import { ProjectConfigModule } from './shared/config/config.module';
import { AppController } from './app.controller';
import { ClientsModule } from '@nestjs/microservices';
import { DatabaseModule } from './modules/database/database.module'
import { PostsModule } from './modules/posts/posts.module';
import { grpcAuthClientOptions, grpcUserClientOptions } from './generates/configGrpc/grpc-client.options';
@Module({
  imports: [
    // TypeOrmModule.forRoot(),
    DatabaseModule,
    ClientsModule.register([
      {
        name: 'AUTH_PACKAGE',
        ...grpcAuthClientOptions
      },
      {
        name: 'USER_PACKAGE',
        ...grpcUserClientOptions
      }
    ]),
    ProjectConfigModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: []
})
export class AppModule { }
