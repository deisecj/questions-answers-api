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
        this.createdAt = attributes.createdAt || new Date();
        this.id = attributes.id;
        this.user = attributes.user;
    }
}
