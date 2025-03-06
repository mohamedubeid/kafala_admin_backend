import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../domain/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async shortenLink(link) {
    const TinyURL = require('tinyurl');
    let shortenedLink = link;
    const res = await TinyURL.shorten(link, { disablePreview: true });
    if (res) {
      shortenedLink = res;
    }

    return shortenedLink;
  }

  async sendRegisterVerivication(user: User, link: string) {
    await this.mailerService
      .sendMail({
        to: user.email,
        from: process.env.MAIL_FROM,
        subject: 'مرحبا بك فى كفالة غزة!',
        template: '../templates/mails/register-confirmationAr.ejs',
        context: {
          name: user.email,
          link,
        },
      })
      .then(() => {
        console.log('success');
      })
      .catch(err => {
        console.log('error');
        console.log(err);
      });
  }

  async sendForgotPasswordToken(user: User, link: string, name?: string) {
    return await this.mailerService
      .sendMail({
        to: user.email,
        from: process.env.MAIL_FROM,
        subject: 'تغيير كلمة مرور  كفالة غزة',
        template: '../templates/mails/forgotPassword-tokenAr.ejs',
        context: {
          name: name ? name : user.firstName,
          link,
        },
      })
      .then(res => 'sucess')
      .catch(err => 'error');
  }
}
