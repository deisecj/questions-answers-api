import bcrypt from "bcrypt"

export class HashPassword {

    static generateHashPassword(password: string): Promise<string> {       
       return bcrypt.genSalt(10) 
            .then((salt) => bcrypt.hash(password, salt))
    }
}
