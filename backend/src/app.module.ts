import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

import { AuthModule } from './Auth/auth.module';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { PrismaModule } from './prisma/prisma.module';
import { EntityModule } from './entity/entity.module';
import { AwsS3Module } from './aws-s3/aws-s3.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';
import { MailModule } from './mail/mail.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
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
    AuthModule, 
    UserModule, 
    BookModule, 
    PrismaModule, 
    EntityModule, 
    AwsS3Module, MailModule
  ],
})
export class AppModule {}
