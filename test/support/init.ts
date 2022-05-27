import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { initServer } from "../../src/serverConfig";
import getClient from '../../src/persistence/dbClient';

export const dbClient = getClient();
export const expressApp = initServer();

export const resetTables = () => {
    const user = dbClient.query("DELETE FROM USERS");
    const auth = dbClient.query("DELETE FROM AUTHENTICATIONS");

    return Promise.all([user, auth]);
}
