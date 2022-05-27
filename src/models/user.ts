import bcrypt from "bcrypt"
import { BusinessError } from "../errors";
import { Authentication } from "./authentication";

export class User {

    email: string;
    password: string;
    id: number;

    constructor(userAttributes: any) {
       this.email = userAttributes.email;
       this.password = userAttributes.password;
       this.id = userAttributes.id;
    }

    signIn(password: string): Promise<Authentication> {
        return bcrypt.compare(password, this.password).then((validPassword) => {

            console.log("result comparacao password", validPassword)
            
            if (validPassword) {
                const auth = new Authentication(this.email);

                console.log("resultado da criacao da auth", auth)
                
                return auth;

            } else {
                throw new BusinessError ("email or password is invalid")
            } 
        });
    }
}
