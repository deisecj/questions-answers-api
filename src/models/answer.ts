import { Question } from "./question";
import { User } from "./user";

export class Answer {

    description: string;
    createdAt: Date;
    id: number;
    user: User;
    question: Question;

    constructor(attributes: any) {
        this.question = attributes.question;
        this.description = attributes.description;
        const defaultDate = new Date();
        defaultDate.setSeconds(0, 0); // remove ms
        this.createdAt = attributes.createdAt || defaultDate;
        this.id = attributes.id;
        this.user = attributes.user;
    }
}
