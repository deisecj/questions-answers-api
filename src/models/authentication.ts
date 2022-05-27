import { GenerateToken } from "../utils/generateToken";
import { User } from "./user";

export class Authentication {

    email: string;
    token: string;
    createdAt: Date;
    id: number;

    constructor(attributes: any) {
        this.email = attributes.email;
        this.token = attributes.token || GenerateToken.generateToken(50);
        this.createdAt = attributes.createdAt || new Date();
        this.id = attributes.id;
    }
}
