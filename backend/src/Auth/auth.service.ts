import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService{
    signIn(){
        return 'Sign In Successful';
    }
    signUp(){
        return 'Sign Up Successful';
    }
}