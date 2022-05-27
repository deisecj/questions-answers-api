import { dbClient } from "./init";

export const totalUserByemail = (email: string | undefined): Promise<number> => {
    return dbClient.query("SELECT count(*) as total FROM USERS WHERE EMAIL = ?", email)
    .then((result) => result[0].total);
}

export const totalAuthByemail = (email: string | undefined): Promise<number> => {
    return dbClient.query("SELECT count(*) as total FROM AUTHENTICATIONS WHERE EMAIL = ?", email)
    .then((result) => result[0].total);
}
