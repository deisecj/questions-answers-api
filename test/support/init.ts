import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { initServer } from "../../src/serverConfig";
import getClient from '../../src/persistence/dbClient';

export const dbClient = getClient();
export const expressApp = initServer();

export const resetTables = async (): Promise<void> => {
    const question = await dbClient.query("DELETE FROM QUESTIONS");
    const user = await dbClient.query("DELETE FROM USERS");
    const auth = await dbClient.query("DELETE FROM AUTHENTICATIONS");
}
