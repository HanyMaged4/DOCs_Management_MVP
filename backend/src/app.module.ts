import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './Auth/auth.module';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { PrismaModule } from './prisma/prisma.module';
import { TagModule } from './tag/tag.module';
import { EntityModule } from './entity/entity.module';
import { AttachmentModule } from './attachment/attachment.module';
import { AttachmentModule } from './attachment/attachment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule, 
    UserModule, 
    BookModule, PrismaModule, TagModule, EntityModule, AttachmentModule
  ]
})
export class AppModule {}
