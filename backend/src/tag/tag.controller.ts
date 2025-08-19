import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagDto } from './dto/tag.dto';
import { JWTGuard } from 'src/Auth/guards';
import { GetUser } from 'src/Auth/decorators/get-user.decorator';


@UseGuards(JWTGuard)
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  create(@Body() createTagDto: TagDto , @GetUser('user_id') userId: number) {
    return this.tagService.create(createTagDto , userId);
  }

  @Get()
  findAll( @GetUser('user_id') userId: number) {
    return this.tagService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string ,  @GetUser('user_id') userId: number) {
    return this.tagService.findOne(+id , userId); 
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagDto: TagDto , @GetUser('user_id') userId: number) {
    return this.tagService.update(+id, updateTagDto , userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('user_id') userId: number) {
    return this.tagService.remove(+id, userId);
  }
}
