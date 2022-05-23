import { initServer } from "../../src/serverConfig";
import dotenv from 'dotenv';
import getClient from '../../src/persistence/dbClient';


dotenv.config({ path: '.env.test' });
export const dbClient = getClient();
export const expressApp = initServer();
