import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { CreateEntityDto } from './dto/create-entity.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';
import { url } from 'inspector';

@Injectable()
export class EntityService {
  
  constructor(private readonly prisma:PrismaService , private readonly aws:AwsS3Service) {}

  async create(createEntityDto: CreateEntityDto, userId: number) {
    console.log('Service received DTO:', createEntityDto);
    console.log('User ID:', userId);

    const book = await this.prisma.book.findUnique({
      where: { book_id: createEntityDto.book_id, owner_id: userId }
    });
    
    if (!book) {
      throw new NotFoundException('Book not found or you do not have permission to access it');
    }
    const { tags, attachments,...entityData } = createEntityDto;

    try {
      const data = await this.prisma.entity.create({
        data: {
          title: entityData.title,
          content: entityData.content,
          book_id: createEntityDto.book_id,
        }
      });
      console.log('Entity created:', data);
      console.log('Tags:', tags);
      if (tags && tags.length > 0) {
        await this.prisma.entity.update({
          where: { entity_id: data.entity_id },
          data: {
            tags: {
              connect: tags.map(tag => ({ tag_id: Number(tag) }))
            }
          }
        });
      }

      // Upload files to AWS and create attachments
      if (attachments && attachments.length > 0) {
        for (const attachment of attachments) {
          const { url, key } = await this.aws.uploadFile(attachment, userId);
          await this.prisma.attachment.create({
            data: {
              url: url,
              S3_Key: key, // Use correct field name (lowercase)
              type: attachment.mimetype.startsWith('image/') ? 'image' : 'video',
              size: attachment.size,
              entity_id: data.entity_id
            }
          });
        }
      }

      return {
        message: 'Entity created successfully',
        entity: { ...data, tags: tags || [] }
      };

    } catch (error) {
      console.error('Entity creation error:', error);
      throw new BadRequestException(`Failed to create entity: ${error.message}`);
    }
  }

  async findAll(userId: number) {

    const user = await this.prisma.user.findUnique({
      where: { user_id: userId }
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return await this.prisma.entity.findMany({
      where: { book: { owner_id: userId } },
      include: { book: true }
    });

  }

  async findOne(id: number, userId: number) {

    const entity =await  this.prisma.entity.findUnique({
      where: { entity_id: id },
      include: { book: true }
    });

    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    if (entity.book.owner_id !== userId) {
      throw new ForbiddenException('You do not have permission to access this entity');
    }

    return entity;
  }

  async findByBookId(bookId: number, userId: number) {
    const book = await this.prisma.book.findUnique({
      where: { book_id: bookId, owner_id: userId }
    });
    if (!book) {
      throw new NotFoundException('Book not found or you do not have permission to access it');
    }
    return await this.prisma.entity.findMany({
      where: { book_id: bookId },
      include: { book: true, tags: true, attachments: true }
    });
  }

  async update(id: number, updateEntityDto: UpdateEntityDto, userId: number) {
    const entity = await this.prisma.entity.findUnique({
      where: { entity_id: id },
      include: { book: true }
    });

    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    if (entity.book.owner_id !== userId) {
      throw new ForbiddenException('You do not have permission to update this entity');
    }

    const { tags, attachments ,...entityData } = updateEntityDto;

    const updatedEntity = await this.prisma.entity.update({
      where: { entity_id: id },
      data: entityData
    });

    if (tags && tags.length > 0) {
      await this.prisma.entity.update({
        where: { entity_id: id },
        data: {
          tags: {
            set: [], // Clear existing tags
            connect: tags.map(tag => ({ tag_id: Number(tag) }))
          }
        }
      });
      
      return { ...updatedEntity, tags };
    }

    return updatedEntity;
  }

  async remove(id: number, userId: number) {
    const entity = await this.prisma.entity.findUnique({
      where: { entity_id: id },
      include: { book: true }
    });

    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    if (entity.book.owner_id !== userId) {
      throw new ForbiddenException('You do not have permission to delete this entity');
    }

    return await this.prisma.entity.delete({
      where: { entity_id: id }
    });  
  }

  async addAttachments(entityId: number, attachments: Express.Multer.File[], userId: number) {
    
    const entity = await this.prisma.entity.findUnique({
      where: { entity_id: entityId },
      include: { book: true }
    });

    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    if (entity.book.owner_id !== userId) {
      throw new ForbiddenException('You do not have permission to add attachments to this entity');
    }

    let urls: string[] = [];
    
    for (let att of attachments) {
      try {
        const { url, key } = await this.aws.uploadFile(att, userId);
        let attachmentData = await this.prisma.attachment.create({
          data: {
            url,
            S3_Key: key,
            type: att.mimetype.startsWith('image/') ? 'img' : 'vid',
            size: att.size,
            entity_id: entityId
          }
        });
        urls.push(attachmentData['url']);
      } catch (error) {
        throw new BadRequestException(`File upload failed: ${error.message}`);
      }
    }

    return urls;
  }

  //remove attachments from entity
  async removeAttachments(entityId: number, attachmentIds: number[], userId: number)
  {
    const entity = await this.prisma.entity.findUnique({
      where: { entity_id: entityId },
      include: { book: true }
    });

    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    if (entity.book.owner_id !== userId) {
      throw new ForbiddenException('You do not have permission to remove attachments from this entity');
    }

    const attachments = await this.prisma.attachment.findMany({
      where: { attachment_id: { in: attachmentIds }, entity_id: entityId }
    });

    for (let attachment of attachments) {
      await this.aws.deleteFile(attachment.S3_Key);
    }

    return await this.prisma.attachment.deleteMany({
      where: { attachment_id: { in: attachmentIds }, entity_id: entityId }
    });
  }
}
