import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { MailerInterface } from '../../domain/interface/mailer';

export class MailerService implements MailerInterface {
    private transporter: nodemailer.Transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        });
    };

    public async sendEmail(to: string, subject: string, otp: string, action: string): Promise<void> {
        let htmlContent: string = fs.readFileSync(path.resolve('./src/infrastructure/mailer/view/otp.html'), 'utf8');
        htmlContent = htmlContent.replace('{{OTP}}', otp);
        htmlContent = htmlContent.replace('{{ACTION}}', action);

        const mailOptions: nodemailer.SendMailOptions = {
            from: `SIGEMES App <${process.env.SMTP_EMAIL}>`,
            to: to,
            subject: subject,
            html: htmlContent
        };

        await this.transporter.sendMail(mailOptions);
    };
};