import { Renter } from '../domain/entity/renter';
import { RenterRepoInterface } from '../domain/interface/renter-repo';
import { JwtInterface } from '../domain/interface/jwt';
import { BcryptInterface } from '../domain/interface/bcrypt';
import { ValidatorInterface } from '../domain/interface/validator';

export class RenterUsecase {
    constructor(
        private renterValidator: ValidatorInterface,
        private renterRepo: RenterRepoInterface,
        private jwtService: JwtInterface,
        private bcryptService: BcryptInterface
    ) {}

    public async login(renter: Renter): Promise<Renter> {
        const loginRequest = this.renterValidator.validate(renter, "login");

        const renterData: Renter|null = await this.renterRepo.getUserByEmail(loginRequest.email);

        if (!renterData) {
            throw new Error('User not found');
        }

        const passwordMatch = await this.bcryptService.comparePassword(loginRequest.password, renterData.password);

        if (!passwordMatch) {
            throw new Error('Invalid password');
        }

        const token: string = this.jwtService.generateToken({
            id: renterData.id,
            email: renterData.email,
            fullname: renterData.fullname,
            emailVerified: renterData.emailVerified,
        });

        renterData.token = token;

        return renterData;
    }
}