import { Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { SentMessageInfo, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter<SentMessageInfo>;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.get<string>('email.smtp.host'),
      port: 2525,
      auth: {
        user: configService.get<string>('email.smtp.auth.user'),
        pass: configService.get<string>('email.smtp.auth.pass'),
      },
    });
  }

  async sendEmail(payload: CreateEmailDto) {
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('email.smtp.email'),
        to: payload.to,
        subject: payload.subject,
        text: payload.text,
      });
    } catch (e) {}
  }
}
