import { Renter } from '../domain/entity/renter';
import { RenterRepoInterface } from '../domain/interface/renter-repo';
import { JwtInterface } from '../domain/interface/jwt';
import { BcryptInterface } from '../domain/interface/bcrypt';
import { ValidatorInterface } from '../domain/interface/validator';
import { ResponseError } from '../domain/error/response-error';

export class RenterUsecase {
    constructor(
        private renterValidator: ValidatorInterface,
        private renterRepo: RenterRepoInterface,
        private jwtService: JwtInterface,
        private bcryptService: BcryptInterface
    ) {}

    public async login(renter: Renter): Promise<Renter> {
        const loginRequest: Renter = this.renterValidator.validate(renter, "login");

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
            role: "renter",
            emailVerified: renterData.emailVerified,
        });

        renterData.token = token;

        return renterData;
    }

    public async getRenterData(renter: Renter): Promise<Renter> {
        const renterData: Renter|null = await this.renterRepo.getUserByEmail(renter.email);

        if (!renterData) {
            throw new Error('User not found');
        }

        return renterData;
    }

    public async register(renter: Renter): Promise<Renter> {
        const registerRequest: Renter = this.renterValidator.validate(renter, "register");

        const renterData: Renter|null = await this.renterRepo.getUserByEmail(registerRequest.email);

        if (renterData) {
            throw new ResponseError('Email already registered', 400);
        }

        const hashedPassword: string = await this.bcryptService.hashPassword(registerRequest.password);
        registerRequest.password = hashedPassword;

        const newRenter: Renter = await this.renterRepo.createUser(registerRequest);

        return newRenter;
    }
}