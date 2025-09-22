import { Module } from '@nestjs/common';
import { EntityService } from './entity.service';
import { EntityController } from './entity.controller';
import { AwsS3Module } from 'src/aws-s3/aws-s3.module';
import { PrismaModule } from 'src/prisma/prisma.module'; // Add this import

@Module({
  imports: [AwsS3Module, PrismaModule], // Add PrismaModule here
  controllers: [EntityController],
  providers: [EntityService],
})
export class EntityModule {}
