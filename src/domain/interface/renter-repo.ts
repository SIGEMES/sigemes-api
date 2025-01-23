import { Renter } from "../entity/renter";

export interface RenterRepoInterface {
    getUserByEmail(email: string): Promise<Renter|null>;
    createUser(renter: Renter): Promise<Renter>;
    updateOTP(id: number, otp: string, otpExpiry: Date): Promise<void>;
    getUserOTPByEmail(email: string): Promise<Renter|null>;
    updateEmailVerified(id: number): Promise<void>;
}