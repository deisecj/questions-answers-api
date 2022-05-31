import { DbClient } from "../persistence/dbClient";
import { Authentication } from "../models/authentication";
import { RecordNotFoundError } from "../errors";

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

    findByToken(authToken: string): Promise<Authentication | undefined> {
        return this.dbClient
            .query("SELECT * FROM AUTHENTICATIONS WHERE TOKEN = ? AND CREATED_AT > NOW() - INTERVAL 15 MINUTE", authToken)
            .then((results) => {
                if (results.length > 0) {
                    const result = results[0];
                    const authFound = new Authentication({ email: result.EMAIL, token: result.TOKEN, createdAt: result.CREATED_AT });
                    return authFound;
                }
            });
    }

    getByToken(authToken: string): Promise<Authentication> {
        return this.findByToken(authToken).then((auth) => {
            if (auth) {
                return auth;
            } else {
                throw new RecordNotFoundError("authentication failed");
            }
        });
    }
}
