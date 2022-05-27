import { User } from "../../src/models/user";
import { faker } from '@faker-js/faker';
import { dbClient } from "../support/init";
import { HashPassword } from "../../src/utils/hashPassword";

export const buildUser = (): User => {
    const user = new User({ email: faker.internet.email(), password: faker.internet.password() });    
    return user;
}

export const persistUser = (user: User): Promise<User> => {
    return HashPassword.generateHashPassword(user.password || '').then((passwordCrypted) => {
        return dbClient
            .query("INSERT INTO USERS (EMAIL, PASSWORD) VALUES (?, ?)", [user.email, passwordCrypted])
            .then((out: any) => {
                user.id = out.insertId;
                return user;
             });
    });
}
