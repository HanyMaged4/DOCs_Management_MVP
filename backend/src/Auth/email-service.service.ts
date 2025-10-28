import { MailerService } from '@nestjs-modules/mailer/dist/mailer.service';
import { Injectable } from '@nestjs/common';
import { verifyEmailTemplate } from './utilities /verifyEmail';
import { resetPasswordTemplate } from './utilities /resetPassword';
@Injectable()
export class EmailServiceService {
    constructor (private mailerService: MailerService) { }
    async sendVerificationEmail(to: string, code: string) {
        //load template
        const temp = verifyEmailTemplate(`http://localhost:3000/auth/verify?code=${code}`);
        await this.mailerService.sendMail({
            to,
            subject: 'Email Verification',
            text: `${temp}`,
        });
    }
    async sendResetPasswordEmail(to: string, code: string) {
        //load template
        const temp = resetPasswordTemplate(`http://localhost:3000/auth/reset-password?code=${code}`);
        await this.mailerService.sendMail({
            to,
            subject: 'Reset Password',
            text: `${temp}`,
        });
    }
}
