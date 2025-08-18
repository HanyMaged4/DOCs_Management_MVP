import { Controller, Delete, Get, Put, UseGuards, Body } from '@nestjs/common';
import type { User } from '../../generated/prisma';
import { GetUser } from '../Auth/decorators/get-user.decorator';
import { JWTGuard } from '../Auth/guards';

@Controller('users') 
@UseGuards(JWTGuard)
export class UserController {
    @Get('me') 
    getMe(@GetUser() user: User) {
        return user;
    }

    @Put('me') 
    updateMe(@GetUser() user: User, @Body() updateData: any) {

        return { message: `Updating user ${user.user_id}`, data: updateData };
    }

    @Delete('me') 
    deleteMe(@GetUser() user: User) {

        return { message: `Deleting user ${user.user_id}` };
    }
}
