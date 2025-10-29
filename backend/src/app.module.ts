import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

import { AuthModule } from './Auth/auth.module';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { PrismaModule } from './prisma/prisma.module';
import { EntityModule } from './entity/entity.module';
import { AwsS3Module } from './aws-s3/aws-s3.module';
import { MailModule } from './mail/mail.module';
import { CacheModule } from './cache/cache.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule, 
    UserModule, 
    BookModule, 
    PrismaModule, 
    EntityModule, 
    AwsS3Module, MailModule, CacheModule
  ],
})
export class AppModule {}