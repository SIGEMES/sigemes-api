import { z } from 'zod';

export class RenterValidation {
    public static id = z.object({
        id: z.number(),
    });

    public static login = z.object({
        email: z.string().email(),
        password: z.string().min(5),
    });

    public static register = z.object({
        email: z.string().email(),
        password: z.string().min(5),
        fullname: z.string().min(3),
        phone_number: z.string().min(10),
        gender: z.enum(['perempuan', 'laki_laki']),
    });

    public static sendEmailOTP = z.object({
        email: z.string().email(),
    });
    
    public static verifyEmailOTP = z.object({
        email: z.string().email(),
        otp: z.string().min(5).max(5),
    });
    
    public static changePassword = z.object({
        old_password: z.string().min(5),
        new_password: z.string().min(5),
    });

    public static changePasswordForgotPassword = z.object({
        email: z.string().email(),
        new_password: z.string().min(5),
    });

    public static updateProfile = z.object({
        fullname: z.string().min(3),
        phone_number: z.string().min(10),
        gender: z.enum(['perempuan', 'laki_laki'],)}
    );
    
}