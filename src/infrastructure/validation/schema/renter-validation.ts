import { z, ZodSchema } from 'zod';

export const RenterValidation: Record<string, ZodSchema<any>> = {
    login: z.object({
        email: z.string().email(),
        password: z.string().min(5),
    }),
    register: z.object({
        email: z.string().email(),
        password: z.string().min(5),
        fullname: z.string().min(3),
        phoneNumber: z.string().min(10),
        gender: z.string().max(5),
    }),
    sendEmailVerificationOTP: z.object({
        email: z.string().email(),
    }),
    verifyEmailVerificationOTP: z.object({
        email: z.string().email(),
        otp: z.string().min(5).max(5),
    }),
};