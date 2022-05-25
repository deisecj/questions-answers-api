export class User {

    email?: string;
    password?: string;
    id: any;

    constructor(userAttributes: any) {
        Object.assign(this, userAttributes);
    }
}
