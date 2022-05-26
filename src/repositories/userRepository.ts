import { User } from "../models/user";
import { DbClient } from "../persistence/dbClient";
import bcrypt from "bcrypt"
import { BusinessError } from "../errors";

export class UserRepository {

    dbClient: DbClient;

    constructor(dbClient: DbClient) {
        this.dbClient = dbClient;
    }

    save(user: User): Promise<void> {
        return new Promise((resolve, reject) => {        
            bcrypt.genSalt(10)
            .then((salt) => user.password ? bcrypt.hash(user.password, salt) : user.password)
            .then(passwordCrypted => {
                user.password = passwordCrypted;
                const values = [user.email, user.password];
                return this.dbClient.query("INSERT INTO USERS (EMAIL, PASSWORD) VALUES (?, ?)", values)
            })
            .then(resolve)
            .catch(reject);
        });
    }

    findUser(email: string): Promise<User | undefined> {
        return this.dbClient.query("SELECT * FROM USERS WHERE EMAIL = ?", email).then((results) => {
            if (results.length > 0) {
               const result = results[0];
               const userFound = new User({ email: result.EMAIL, password: result.PASSWORD });
               userFound.id = result.ID;
               return userFound;
            } 
         });       
    }
}
