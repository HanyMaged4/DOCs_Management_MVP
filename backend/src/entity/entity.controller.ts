import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
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
  create(@Body() createEntityDto: CreateEntityDto , @GetUser('user_id') userId: number) {
    return this.entityService.create(createEntityDto , userId);
  }

  @Get()
  findAll( @GetUser('user_id') userId: number) {
    return this.entityService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string ,@GetUser('user_id') userId: number) {
    return this.entityService.findOne(+id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEntityDto: UpdateEntityDto, @GetUser('user_id') userId: number) {
    return this.entityService.update(+id, updateEntityDto , userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('user_id') userId: number) {
    return this.entityService.remove(+id , userId);
  }
}
