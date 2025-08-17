import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './Auth/auth.module';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule, 
    UserModule, 
    BookModule, PrismaModule
  ]
})
export class AppModule {}
