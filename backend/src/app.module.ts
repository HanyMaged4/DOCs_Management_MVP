import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

import { AuthModule } from './Auth/auth.module';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { PrismaModule } from './prisma/prisma.module';
import { EntityModule } from './entity/entity.module';
import { AwsS3Module } from './aws-s3/aws-s3.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true, 
      useFactory: async (config: ConfigService) => {
        const host = config.get<string>('REDIS_HOST') ?? 'localhost';
        const port = config.get<number>('REDIS_PORT') ?? 6379;
        return {
          store: redisStore as unknown as any,
          socket: {
            host,
            port,
          },
          ttl: 600, 
        };
      },
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const host = config.get<string>('SMTP_HOST') ?? 'localhost';
        const port = Number(config.get<number>('SMTP_PORT') ?? 587);
        const user = config.get<string>('SMTP_USER');
        const pass = config.get<string>('SMTP_PASS');
        const from = config.get<string>('SMTP_FROM') ?? 'no-reply@example.com';

        return {
          transport: {
            host,
            port,
            secure: port === 465,
            auth: user && pass ? { user, pass } : undefined,
          },
          defaults: {
            from,
          },
        };
      },
    }),
    AuthModule, 
    UserModule, 
    BookModule, 
    PrismaModule, 
    EntityModule, 
    AwsS3Module
  ],
})
export class AppModule {}
