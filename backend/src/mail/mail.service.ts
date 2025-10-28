import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';


@Injectable()
export class MailService {

  private resend: Resend;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.resend = new Resend(this.configService.get<string>('RESENT_API'));
  }

  async sendEmail(to: string, subject: string, html: string) {
    await this.resend.emails.send({
      from: 'My App <onboarding@resend.dev>',
      to,
      subject,
      html,
    });
  }
}
