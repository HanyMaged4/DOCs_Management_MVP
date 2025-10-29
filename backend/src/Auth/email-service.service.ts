import { Injectable } from '@nestjs/common';
import { verifyEmailTemplate } from './utilities /verifyEmail';
import { resetPasswordTemplate } from './utilities /resetPassword';
import { MailService } from 'src/mail/mail.service';
@Injectable()
export class EmailServiceService {
    constructor (private mailerService: MailService) { }

    async sendVerificationEmail(to: string, code: string) {

        const temp:string = verifyEmailTemplate(`http://localhost:3000/auth/verify?code=${code}`);

        return await this.handleSending(to,'Email Verification',temp);
    }
    
    async sendResetPasswordEmail(to: string, code: string) {
        
        const temp = resetPasswordTemplate(`http://localhost:3000/auth/reset-password?code=${code}`);

        return await this.handleSending(to,'Reset Password',temp);
    }
    
    async handleSending(to:string ,title:string , temp:string){
        try {
            await this.mailerService.sendEmail(
            to,
            title,
            temp,
        );
        } catch (error) {
            console.error(`Failed to send verification email to ${to}:`, error);
        }
    }
}
