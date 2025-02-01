import { Renter } from "../../entity/renter";

export interface RenterRepositoryInterface {
    getRenterById(id: number): Promise<Renter|null>;
    getRenterByEmail(email: string): Promise<Renter|null>;
    createRenter(renter: Renter): Promise<Renter>;
    updateOTP(id: number, otp: string, otpExpiry: Date): Promise<void>;
    getRenterOTPByEmail(email: string): Promise<Renter|null>;
    updateEmailVerified(id: number): Promise<void>;
    updateForgotPasswordVerified(id: number): Promise<void>;
    updatePassword(id: number, password: string): Promise<void>;
    updatePasswordForgotPassword(id: number, password: string): Promise<void>;
    updateProfile(id: number, renter: Renter): Promise<Renter>;
}