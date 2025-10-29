import { Injectable, ConflictException, InternalServerErrorException, ForbiddenException, Inject } from "@nestjs/common";
import * as argon from 'argon2';
import { SignInDto, SignUpDto } from "./DTOs/index";
import { PrismaService } from "src/prisma/prisma.service";
import { error } from "console";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { EmailServiceService } from "./email-service.service";
import { generateRandomNum } from "./utilities /genCode";
import { CacheService } from "src/cache/cache.service";
@Injectable()
export class AuthService{
    
    constructor(
        private prisma:PrismaService ,
        private jwt:JwtService,
        private config:ConfigService,
        private emailService:EmailServiceService,
        private cache:CacheService
    ) {}

    async signIn(dto : SignInDto){
        // check if the user exists
        const targetUSer = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        })
        if(!targetUSer) {
            throw new ForbiddenException('Email not found');
        }
        // compare password
        const isPasswordValid = await argon.verify(targetUSer.password, dto.password);
        if(!isPasswordValid) {
            throw new ForbiddenException('Invalid password');
        }

        return this.signToken(targetUSer.user_id , targetUSer.email);
    }


    async signUp(dto : SignUpDto){
        // Hash the password    
        const hashedPassword = await argon.hash(dto.password);
        const hashedSecPassword = dto.sec_password ? await argon.hash(dto.sec_password) : null;
    
        try{
            console.log('Creating user with email:', dto);
        const user = await this.prisma.user.create(
            {
                data:{
                    email: dto.email,
                    username: dto.username,
                    sec_password: hashedSecPassword,
                    password: hashedPassword,
                }
            }
        );
        console.log('User created successfully:', user);
        return await this.signToken(user.user_id, user.email);
       }catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('User with this email or username already exists');
            }
            throw error;
       }
    }

    async signToken( userId : number,email : string){
        const payload = {
            sub:userId,
            email
        }
        const secret = this.config.get('JWT_SECRET');
        const token =  await this.jwt.signAsync(payload , {
            "expiresIn": '1h',
            "secret":secret,
        })
        return {
            access_token: token,
            expires_in: 3600, // 1 hour in seconds
        };
    }

    async sendVerificationEmail(email:string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new ForbiddenException('Email not found');
        }
        const code = generateRandomNum(6);
        console.log(`Generated verification code for ${email}: ${code}`);
        try {
            await this.emailService.sendVerificationEmail(email, code);
             await this.cache.set(`email-verification-${email}`, code, 15 * 60);
         } catch (err) {
            console.error('Error sending verification email:', err);
            throw new InternalServerErrorException('Failed to send verification email');
        }
        console.log(`Verification email sent to ${email} with code ${code}`);
    }

    async verifyEmail(email: string, code: string) {
        const cachedCode = await this.cache.get(`email-verification-${email}`);
        if (cachedCode !== code) 
            throw new ForbiddenException('Invalid or expired verification code');

        // to-do: update user record to mark email as verified

        await this.cache.del(`email-verification-${email}`);
        return { message: 'Email verified successfully' };
    }

}