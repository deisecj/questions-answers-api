import { RecordNotFoundError } from "../errors";
import { Answer } from "../models/answer";
import { User } from "../models/user";
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

    findByQuestion(questionID: number): Promise<Array<Answer>> {
        return this.dbClient.query("SELECT ANSWERS.*, USERS.EMAIL FROM ANSWERS INNER JOIN USERS ON ANSWERS.USER_ID = USERS.ID WHERE QUESTION_ID=?", questionID).then((results) => {
            const answers: Array<Answer> = [];
            results.forEach((result: any) => {
                const user = new User({ id: result.USER_ID, email: result.EMAIL })
                const answer = new Answer({ description: result.DESCRIPTION, createdAt: result.CREATED_AT, user: user, id: result.ID });
                answers.push(answer);
            })
            return answers;
        });  
    }
}
