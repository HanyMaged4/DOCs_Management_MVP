import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWTGuard } from 'src/Auth/guards';

@Controller('users')
export class UserController {
    @UseGuards(JWTGuard)
    @Get('me')
    getMe(){
        return 'User details';
    }
}
