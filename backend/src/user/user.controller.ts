import { Controller, Delete, Get, Put, UseGuards, Body } from '@nestjs/common';
import type { User } from '../../generated/prisma';
import { GetUser } from '../Auth/decorators/get-user.decorator';
import { JWTGuard } from '../Auth/guards';
import { UserService } from './user.service';
import { UpdateUserDto } from './DTos';

@Controller('users') 
@UseGuards(JWTGuard)
export class UserController {
    constructor(private readonly UserService: UserService) {}

    @Get('me') 
    getMe(@GetUser() user: User) {
        return this.UserService.getMe(user);
    }

    @Put('me') 
    updateMe(@GetUser('user_id') userid: number, @Body() updateData: UpdateUserDto) {
       
        return this.UserService.putMe(userid, updateData);
    }

    @Delete('me') 
    deleteMe(@GetUser('user_id') userId: number) {

        return this.UserService.deleteMe(userId);
    }
}
