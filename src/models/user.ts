import bcrypt from "bcrypt"
import { BusinessError } from "../errors";
import { Authentication } from "./authentication";

export class User {

    email: string;
    password: string;
    id: number;

    constructor(attributes: any) {
       this.email = attributes.email;
       this.password = attributes.password;
       this.id = attributes.id;
    }

    signIn(password: string): Promise<Authentication> {
        return bcrypt.compare(password, this.password).then((validPassword) => {            
            if (validPassword) {
                const auth = new Authentication({ email: this.email });
                return auth;
            } else {
                throw new BusinessError ("email or password is invalid")
            } 
        });
    }
}
