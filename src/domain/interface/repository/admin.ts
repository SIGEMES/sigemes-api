import { Admin } from "../../entity/admin";

export interface AdminRepositoryInterface {
    getAllAdmin(): Promise<Admin[]>;
    getAdminById(id: number): Promise<Admin|null>;
    getAdminByEmail(email: string): Promise<Admin|null>;
}