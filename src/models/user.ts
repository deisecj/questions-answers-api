export class User {

    email?: string;
    password?: string;
    id?: number;

    constructor(userAttributes: any) {
        Object.assign(this, userAttributes);
    }
}
