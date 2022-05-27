import { DbClient } from "../persistence/dbClient";
import { Authentication } from "../models/authentication";

export class AuthenticationRepository {

    dbClient: DbClient;

    constructor(dbClient: DbClient) {
        this.dbClient = dbClient;
    }

    save(auth: Authentication): Promise<Authentication> {
        return new Promise((resolve, reject) => {
            const values = [auth.email, auth.token, auth.createdAt.toISOString().slice(0, 19).replace('T', ' ')];
            this.dbClient.query(
                "INSERT INTO AUTHENTICATIONS (EMAIL, TOKEN, CREATED_AT) VALUES (?, ?, ?)", 
                values)
            .then(() => resolve(auth))
            .catch(reject);
        });  
    }
}
