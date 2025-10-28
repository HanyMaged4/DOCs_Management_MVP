import { Injectable } from '@nestjs/common';
import { verifyEmailTemplate } from './utilities /verifyEmail';
import { resetPasswordTemplate } from './utilities /resetPassword';
import { MailService } from 'src/mail/mail.service';
@Injectable()
export class EmailServiceService {
    constructor (private mailerService: MailService) { }

    async sendVerificationEmail(to: string, code: string) {
        //load template
        const temp:string = verifyEmailTemplate(`http://localhost:3000/auth/verify?code=${code}`);
        console.log('Verification email template:', temp);
        try {
            await this.mailerService.sendEmail(
                to,
                'Email Verification',
                temp,
            );
            console.log(`Verification email sent to ${to}`);
        } catch (error) {
            console.error(`Failed to send verification email to ${to}:`, error);
        }
    }
    
    async sendResetPasswordEmail(to: string, code: string) {
        //load template
        const temp = resetPasswordTemplate(`http://localhost:3000/auth/reset-password?code=${code}`);
        await this.mailerService.sendEmail(
            to,
            'Reset Password',
            temp,
        );
    }
}
