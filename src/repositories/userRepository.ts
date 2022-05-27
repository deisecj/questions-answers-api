import { User } from "../models/user";
import { DbClient } from "../persistence/dbClient";
import bcrypt from "bcrypt"
import { RecordNotFoundError } from "../errors";
import { HashPassword } from "../utils/hashPassword";

export class UserRepository {

    dbClient: DbClient;

    constructor(dbClient: DbClient) {
        this.dbClient = dbClient;
    }

    save(user: User): Promise<void> {
          return HashPassword.generateHashPassword(user.password || '').then((passwordCrypted) => {
            user.password = passwordCrypted;
            const values = [user.email, user.password];
            return this.dbClient.query("INSERT INTO USERS (EMAIL, PASSWORD) VALUES (?, ?)", values)
          })
       
    }

    findUserbyEmail(email: string): Promise<User | undefined> {
        return this.dbClient.query("SELECT * FROM USERS WHERE EMAIL = ?", email).then((results) => {
            if (results.length > 0) {
               const result = results[0];
               const userFound = new User({ email: result.EMAIL, password: result.PASSWORD, id: result.id });
               return userFound;
            } 
         });       
    }

    getByEmail(email: string): Promise<User> {
        return this.findUserbyEmail(email).then((user) => {
            if (user) {
                return user;
            } else {
                throw new RecordNotFoundError("user not found!")
            }
        });
    }
}
