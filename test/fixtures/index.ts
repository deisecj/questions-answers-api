import { User } from "../../src/models/user";
import { faker } from '@faker-js/faker';
import { dbClient } from "../support/init";
import { HashPassword } from "../../src/utils/hashPassword";
import { Authentication } from "../../src/models/authentication";
import { Question } from "../../src/models/question";
import { Answer } from "../../src/models/answer";

export const buildUser = (): User => {
    const user = new User({ email: faker.internet.email(), password: faker.internet.password() });
    return user;
}

export const persistUser = (user: User): Promise<User> => {
    return HashPassword.generateHashPassword(user.password || '').then((passwordCrypted) => {
        return dbClient
            .query("INSERT INTO USERS (EMAIL, PASSWORD) VALUES (?, ?)", [user.email, passwordCrypted])
            .then((out: any) => {
                user.id = out.insertId;
                return user;
            });
    });
}

export const buildAuth = (user: User): Authentication => {
    const auth = new Authentication({ email: user.email });
    return auth;
}

export const persistAuth = (auth: Authentication): Promise<Authentication> => {
    return dbClient.query("INSERT INTO AUTHENTICATIONS (EMAIL, TOKEN, CREATED_AT) VALUES (?, ?, ?)", 
                          [auth.email, auth.token, auth.createdAt.toISOString().slice(0, 19).replace('T', ' ')])
                   .then((out: any) => {
                       auth.id = out.insertId;
                       return auth;
                   });
}

export const buildExpiredAuth =  (user: User): Authentication => {
    const auth = new Authentication({ email: user.email });
    const expiredDate = new Date();
    expiredDate.setMinutes(expiredDate.getMinutes() - 16);
    auth.createdAt = expiredDate;
    return auth;
}

export const buildQuestion = (user: User): Question => {
    const question = new Question({ title: faker.hacker.phrase(), description: faker.lorem.paragraph(), user: user });
    return question;
}

export const persistQuestion = (question: Question): Promise<Question> => {
    return dbClient.query("INSERT INTO QUESTIONS (TITLE, DESCRIPTION, CREATED_AT, USER_ID) VALUES (?, ?, ?, ?)", 
                          [question.title, question.description, question.createdAt, question.user.id])
                   .then((out: any) => {
                    question.id = out.insertId;
                       return question;
                   });
}

export const buildAnswer = (user: User, question: Question): Answer => {
    const answer = new Answer({ description: faker.lorem.paragraph(), user: user, question: question });
    return answer;
}

export const persistAnswer = (answer: Answer): Promise<Answer> => {
    return dbClient.query("INSERT INTO ANSWERS (QUESTION_ID, DESCRIPTION, CREATED_AT, USER_ID) VALUES (?, ?, ?, ?)", 
                          [answer.question.id, answer.description, answer.createdAt, answer.user.id])
                   .then((out: any) => {
                    answer.id = out.insertId;
                       return answer;
                   });
}
