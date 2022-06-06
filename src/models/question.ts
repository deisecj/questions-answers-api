import { User } from "./user";

export class Question {

    title: string;
    description: string;
    createdAt: Date;
    id: number;
    user: User;

    constructor(attributes: any) {
        this.title = attributes.title;
        this.description = attributes.description;
        const defaultDate = new Date();
        defaultDate.setSeconds(0, 0); // remove ms
        this.createdAt = attributes.createdAt || defaultDate;
        this.id = attributes.id;
        this.user = attributes.user;
    }
}
