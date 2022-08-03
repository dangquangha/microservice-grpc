import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('POSTGRES_HOST'),
          port: configService.get<number>('POSTGRES_PORT'),
          username: configService.get<string>('POSTGRES_USER'),
          password: configService.get<string>('POSTGRES_PASSWORD'),
          database: configService.get<string>('POSTGRES_DB'),
          entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
          synchronize: true,
          ssl:
            configService.get<string>('ENVIRONMENT') != 'local'
              ? {
                rejectUnauthorized: false,
              }
              : false,
        };
      },
    }),
  ],
})
export class DatabaseModule { }
