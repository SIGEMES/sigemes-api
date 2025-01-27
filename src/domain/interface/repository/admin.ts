import { Admin } from "../../entity/admin";

export interface AdminRepositoryInterface {
    getAdminById(id: number): Promise<Admin|null>;
    getAdminByEmail(email: string): Promise<Admin|null>;
}