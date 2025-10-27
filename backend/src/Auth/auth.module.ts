import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { EmailServiceService } from "./email-service.service";

@Module({
    imports:[
        PassportModule,
        JwtModule.register({}) ,
    ],
    controllers: [AuthController],
    providers:[
        AuthService,
        JwtStrategy,
        EmailServiceService
    ]
})
export class AuthModule {}