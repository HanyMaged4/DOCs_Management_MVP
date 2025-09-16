import { ConflictException, Injectable } from '@nestjs/common';
import { TagDto } from './dto/tag.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TagService {
  constructor(private readonly prisma : PrismaService) {}
  async create(createTagDto: TagDto , userId: number) {
    const isExists = await this.prisma.tag.findFirst({
      where:{
        tag_title: createTagDto.tag_title,
        user_id: userId
      }
    });
    
    if(isExists) {
      throw new ConflictException({ message: 'Tag already exists' });
    }

    const user = await this.prisma.user.findUnique({
      where: { user_id: userId }
    });

    if (!user) {
      throw new ConflictException({ message: 'User not found' });
    }

    return await this.prisma.tag.create({
      data: {
        tag_title: createTagDto.tag_title,
        user_id: userId
      }
    });

  }

  async findAll(userId: number) {
    const checkUser = await this.prisma.user.findUnique({
      where: { user_id: userId }
    });
    if (!checkUser) {
      throw new ConflictException({ message: 'User has been deleted' });
    }
    return this.prisma.tag.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });

  }

  async findOne(id: number , userId: number) {
    const checktag = await this.prisma.tag.findUnique({
      where: { tag_id: id, user_id: userId }
    });
    if (!checktag) {
      throw new ConflictException({ message: 'Tag not found' });
    }
    return checktag;

  }

  async update(id: number, updateTagDto: TagDto ,userId: number) {
    const checktag = await this.prisma.tag.findUnique({
      where: { tag_id: id, user_id: userId }
    });
    
    if (!checktag) {
      throw new ConflictException({ message: 'Tag not found' });
    }
    // Check if the tag title already exists for the user
    const existingTag = await this.prisma.tag.findUnique({
      where: {
        tag_title: updateTagDto.tag_title,
        user_id: userId
      }
    });
    if (existingTag && existingTag.tag_id !== id) {
      throw new ConflictException({ message: 'Tag title already exists' });
    }
    return await this.prisma.tag.update({
      where: { tag_id: id, user_id: userId },
      data: {
        tag_title: updateTagDto.tag_title,
      }
    });
  }

  async remove(id: number,userId: number) {
    const checktag = await this.prisma.tag.findUnique({
      where: { tag_id: id, user_id: userId }
    });
    
    if (!checktag) {
      throw new ConflictException({ message: 'Tag not found' });
    }

    return await this.prisma.tag.delete({
      where: { tag_id: id, user_id: userId }
    });
  }
}
