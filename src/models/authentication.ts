import { GenerateToken } from "../utils/generateToken";

export class Authentication {

    id?: number;
    token: string;
    email: string;
    createdAt: Date;

    constructor(email: string) {
        this.email = email;
        this.token = GenerateToken.generateToken(50);
        this.createdAt = new Date();

    }
}
