import { User } from "../../src/models/user";
import { dbClient } from "./init";

export const totalUserByEmail = (email: string | undefined): Promise<number> => {
    return dbClient.query("SELECT count(*) as total FROM USERS WHERE EMAIL = ?", email)
    .then((result) => result[0].total);
}

export const totalAuthByEmail = (email: string | undefined): Promise<number> => {
    return dbClient.query("SELECT count(*) as total FROM AUTHENTICATIONS WHERE EMAIL = ?", email)
    .then((result) => result[0].total);
}

export const totalQuestionByUser = (user: User): Promise<number> => {
    return dbClient.query("SELECT count(*) as total FROM QUESTIONS WHERE USER_ID = ?", user.id)
    .then((result) => result[0].total);
}

export const totalAnswerByUser = (user: User): Promise<number> => {
    return dbClient.query("SELECT count(*) as total FROM ANSWERS WHERE USER_ID = ?", user.id)
    .then((result) => result[0].total);
}
