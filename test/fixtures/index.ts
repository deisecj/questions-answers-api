import { User } from "../../src/models/user";
import { faker } from '@faker-js/faker';

export const buildUser = (): User => {
    const user = new User({ email: faker.internet.email(), password: faker.internet.password() });
    return user;
}
