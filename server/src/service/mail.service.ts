import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../domain/user.entity';
import { RelChildKafeelDTO } from './dto/rel-child-kafeel.dto';
import dayjs from 'dayjs';

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

  async sendEmail(relChildKafeelDTO: RelChildKafeelDTO, userType: 'sponsor' | 'guardian') {

    const today = new Date().toISOString();
    const formatted = dayjs().format('DD MMMM YYYY');;
    await this.mailerService
      .sendMail({
        to: userType == 'sponsor' ? relChildKafeelDTO.kafeel.user.email : relChildKafeelDTO.child.createdBy,
        from: process.env.MAIL_FROM,
        subject: 'كفالة غزة',
        template: '../templates/mails/sponsorAr.ejs',
        context: {
          userName: userType == 'sponsor' ? relChildKafeelDTO.kafeel.user.firstName : relChildKafeelDTO.child.createdBy,
          amount: relChildKafeelDTO.cost,
          childName: relChildKafeelDTO.child.familyName + ' ' + relChildKafeelDTO.child.fatherName +  ' ' + relChildKafeelDTO.child.familyName,
          date: formatted,
          status: relChildKafeelDTO.status, //ACCEPTED | REJECTED
          userType //sponsor | guardian
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
}
