import { Injectable } from '@nestjs/common';
import { CreateEntityDto } from './dto/create-entity.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EntityService {
  
  constructor(private readonly prisma:PrismaService) {}

  async create(createEntityDto: CreateEntityDto, userId: number) {

    const book = await this.prisma.book.findUnique({
      where: { book_id: createEntityDto.book_id, owner_id: userId }
    });
    
    if (!book) {
      throw new Error('Book not found or you do not have permission to add entities to this book');
    }
    const { tags, ...entityData } = createEntityDto;

    const data = await this.prisma.entity.create({
      data: {
        ...entityData,
        book_id: createEntityDto.book_id,
      }
    });

    if (tags && tags.length > 0) {
      await this.prisma.entity.update({
        where: { entity_id: data.entity_id },
        data: {
          tags: {
            connect: tags.map(tag => ({ tag_id: Number(tag) }))
          }
        }
      });
      return { ...data, tags };
    }
  }

  async findAll(userId: number) {

    const user = await this.prisma.user.findUnique({
      where: { user_id: userId }
    });
    
    if (!user) {
      throw new Error('User not found');
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

    if (!entity || entity.book.owner_id !== userId) {
      throw new Error('Entity not found or you do not have permission to access this entity');
    }

    return entity;
  }

  async update(id: number, updateEntityDto: UpdateEntityDto, userId: number) {
    const entity = await this.prisma.entity.findUnique({
      where: { entity_id: id },
      include: { book: true }
    });

    if (!entity || entity.book.owner_id !== userId) {
      throw new Error('Entity not found or you do not have permission to update this entity');
    }

    const { tags, ...entityData } = updateEntityDto;

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

    if (!entity || entity.book.owner_id !== userId) {
      throw new Error('Entity not found or you do not have permission to delete this entity');
    }

    return await this.prisma.entity.delete({
      where: { entity_id: id }
    });  
  }
}
