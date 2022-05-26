import { User } from "../../src/models/user";
import { faker } from '@faker-js/faker';
import { dbClient } from "../support/init";

export const buildUser = (): User => {
    const user = new User({ email: faker.internet.email(), password: faker.internet.password() });
    return user;
}

export const persistUser = (user: User): Promise<User> => {
    return dbClient
    .query("INSERT INTO USERS (EMAIL, PASSWORD) VALUES (?, ?)", [user.email, user.password])
    .then((out: any) => {
        user.id = out.insertId;
        return user;
    });
}
