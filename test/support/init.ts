import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { initServer } from "../../src/serverConfig";
import getClient from '../../src/persistence/dbClient';

export const dbClient = getClient();
export const expressApp = initServer();

export const resetTables = () => {
    return dbClient.query("DELETE FROM USERS");
}
