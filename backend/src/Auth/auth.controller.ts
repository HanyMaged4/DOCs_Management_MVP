import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto } from "./DTOs/index";

@Controller('auth')
export class AuthController{
    constructor(private authService:AuthService){}
    @Post('signin')
    signIn(@Body() SignInDTO: SignInDto) {
        
        return this.authService.signIn();
    }
    @Post('signup')
    signUp() {
        return this.authService.signUp();
    }
}