import { dbClient } from "./init";

export const totalUserByemail = (email: string | undefined): Promise<number> => {
    return dbClient.query("SELECT count(*) as total FROM USERS WHERE email = ?", email).then((result) => result[0].total);
}
