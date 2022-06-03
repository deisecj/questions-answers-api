import { Question } from "../models/question";
import { DbClient } from "../persistence/dbClient";

export class QuestionRepository {

    dbClient: DbClient;

    constructor(dbClient: DbClient) {
        this.dbClient = dbClient;
    }

    save(question: Question): Promise<Question> {
        return new Promise((resolve, reject) => {
            const values = [question.title, question.description, question.createdAt.toISOString().slice(0, 19).replace('T', ' '), question.user.id];
            this.dbClient.query(
                "INSERT INTO QUESTIONS (TITLE, DESCRIPTION, CREATED_AT, USER_ID) VALUES (?, ?, ?, ?)", 
                values)
            .then(() => resolve(question))
            .catch(reject);
        });   
    }
}
