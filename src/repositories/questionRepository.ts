import { QuestionController } from "../controllers/questionController";
import { BusinessError } from "../errors";
import { Question } from "../models/question";
import { User } from "../models/user";
import { DbClient } from "../persistence/dbClient";

export class QuestionRepository {

    dbClient: DbClient;

    constructor(dbClient: DbClient) {
        this.dbClient = dbClient;
    }

    save(question: Question): Promise<Question> {
        return new Promise((resolve, reject) => {
            const values = [question.title, question.description, question.createdAt, question.user.id];
            this.dbClient.query(
                "INSERT INTO QUESTIONS (TITLE, DESCRIPTION, CREATED_AT, USER_ID) VALUES (?, ?, ?, ?)", 
                values)
            .then(() => resolve(question))
            .catch(reject);
        });   
    }

    findAll(): Promise<Array<Question>> {
        return this.dbClient.query("SELECT QUESTIONS.*, USERS.EMAIL FROM QUESTIONS INNER JOIN USERS ON QUESTIONS.USER_ID = USERS.ID").then((results) => {
            const questions: Array<Question> = [];
            results.forEach((result: any) => {
                const user = new User({ id: result.USER_ID, email: result.EMAIL })
                const question = new Question({ title: result.TITLE, description: result.DESCRIPTION, createdAt: result.CREATED_AT, user: user, id: result.ID });
                questions.push(question);
            })
            return questions;
        });  
    }

    findByID(questionID: number): Promise<Question | undefined> {
        return this.dbClient.query("SELECT QUESTIONS.*, USERS.EMAIL FROM QUESTIONS INNER JOIN USERS ON QUESTIONS.USER_ID = USERS.ID WHERE QUESTIONS.ID = ?", questionID)
        .then((results) => {
            if (results.length > 0) {
                const result = results[0];
                const user = new User({ id: result.USER_ID, email: result.EMAIL })
                const question = new Question({ title: result.TITLE, description: result.DESCRIPTION, createdAt: result.CREATED_AT, user: user, id: result.ID });
                return question;
            } 
        });  
    }

    getByID(questionID: number): Promise<Question> {
        return this.findByID(questionID).then((question) => {
            if (question) {
                return question;
            } else {
                throw new BusinessError("question not found!")
            }
        });
    }
}
