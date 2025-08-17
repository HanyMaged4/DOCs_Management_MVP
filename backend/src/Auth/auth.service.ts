import { Injectable, ConflictException, InternalServerErrorException, ForbiddenException } from "@nestjs/common";
import * as argon from 'argon2';
import { SignInDto, SignUpDto } from "./DTOs/index";
import { PrismaService } from "src/prisma/prisma.service";
import { error } from "console";
@Injectable()
export class AuthService{
    constructor(private prisma:PrismaService) {}
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

        const { password, sec_password, ...userWithoutPassword } = targetUSer;
        return userWithoutPassword;
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
        const { password, sec_password, ...userWithoutPassword } = user;
        return userWithoutPassword;
       }catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('User with this email or username already exists');
            }
            throw error;
       }
    }




}