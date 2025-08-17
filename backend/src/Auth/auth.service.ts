import { Injectable, ConflictException, InternalServerErrorException, ForbiddenException } from "@nestjs/common";
import * as argon from 'argon2';
import { SignInDto, SignUpDto } from "./DTOs/index";
import { PrismaService } from "src/prisma/prisma.service";
import { error } from "console";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class AuthService{
    
    constructor(private prisma:PrismaService , private jwt:JwtService,private config:ConfigService) {}


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



}