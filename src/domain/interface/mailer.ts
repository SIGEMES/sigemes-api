export interface MailerInterface {
    sendEmail(to: string, subject: string, otp: string, action: string): Promise<void>;
}