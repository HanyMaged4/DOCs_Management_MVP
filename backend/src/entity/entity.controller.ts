import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  UseInterceptors,
  UploadedFiles
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { EntityService } from './entity.service';
import { CreateEntityDto } from './dto/create-entity.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';
import { JWTGuard } from 'src/Auth/guards';
import { GetUser } from 'src/Auth/decorators/get-user.decorator';

@UseGuards(JWTGuard)
@Controller('entities')
export class EntityController {
  constructor(private readonly entityService: EntityService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('attachments', 10, {
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
      const allowedMimes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/webm', 'video/quicktime'
      ];
      if (allowedMimes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(new Error('Only image and video files are allowed'), false);
      }
    },
  }))
  create(
    @Body() createEntityDto: CreateEntityDto,
    @UploadedFiles() attachments: Express.Multer.File[],
    @GetUser('user_id') userId: number
  ) {
    console.log('=== RECEIVED DATA ===');
    console.log('Raw DTO:', createEntityDto);
    console.log('book_id:', createEntityDto.book_id, typeof createEntityDto.book_id);
    console.log('title:', createEntityDto.title, typeof createEntityDto.title);
    console.log('content:', createEntityDto.content, typeof createEntityDto.content);
    console.log('tags:', createEntityDto.tags, typeof createEntityDto.tags);
    console.log('Files:', attachments?.length || 0);
    console.log('User ID:', userId);
    console.log('===================');
    

    createEntityDto.attachments = attachments || [];
    return this.entityService.create(createEntityDto, +userId);
  }

  @Get()
  findAll(@GetUser('user_id') userId: number) {
    return this.entityService.findAll(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('user_id') userId: number) {
    return this.entityService.findOne(+id, +userId);
  }
  @Get('book/:bookId')
  findByBook(@Param('bookId') bookId: string, @GetUser('user_id') userId: number) {
    return this.entityService.findByBookId(+bookId, +userId);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEntityDto: UpdateEntityDto, @GetUser('user_id') userId: number) {
    return this.entityService.update(+id, updateEntityDto, +userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('user_id') userId: number) {
    return this.entityService.remove(+id, +userId);
  }
  
}
