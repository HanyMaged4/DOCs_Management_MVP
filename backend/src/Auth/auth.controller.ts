import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto, SignUpDto } from "./DTOs/index";

@Controller('auth')
export class AuthController{
    constructor(private authService:AuthService){}
    @Post('signin')
    signIn(@Body() dto: SignInDto) {
        return this.authService.signIn(dto);
    }
    @Post('signup')
    signUp(@Body() dto:SignUpDto) {
        return this.authService.signUp(dto);
    }
    
    @Post('verify-email')
    verifyEmail(@Body('code') code: string , @Body('email') email:string) {
        return this.authService.verifyEmail(email, code);
    }
    @Post('resend-verification')
    resendVerification(@Body('email') email: string) {
        return this.authService.sendVerificationEmail(email);
    }

    @Post('forgot-password')
    forgotPassword(@Body('email') email: string) {
        return this.authService.forgotPassword(email);
    }
    @Post('reset-password')
    resetPassword(@Body('email') email: string ,@Body('code') code: string, @Body('newPassword') newPassword: string) {
        return this.authService.passwordUpdate(email , code, newPassword);
    }
}