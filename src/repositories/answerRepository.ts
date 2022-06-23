import { Answer } from "../models/answer";
import { DbClient } from "../persistence/dbClient";

export class AnswerRepository {

    dbClient: DbClient;

    constructor(dbClient: DbClient) {
        this.dbClient = dbClient;
    }

    save(answer: Answer): Promise<Answer> {
        return new Promise((resolve, reject) => {
            const values = [answer.question.id, answer.description, answer.createdAt, answer.user.id];
            this.dbClient.query(
                "INSERT INTO ANSWERS (QUESTION_ID, DESCRIPTION, CREATED_AT, USER_ID) VALUES (?, ?, ?, ?)", 
                values)
            .then(() => resolve(answer))
            .catch(reject);
        });   
    }
}
