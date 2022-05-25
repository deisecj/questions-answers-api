import { User } from "../models/user";
import { DbClient } from "../persistence/dbClient";
import bcrypt from "bcrypt"

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
}
