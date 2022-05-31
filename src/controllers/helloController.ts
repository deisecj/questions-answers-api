import { Request, Response } from 'express';
import getClient from '../persistence/dbClient';

class HelloController {
    
    hello(req: Request, res: Response) {
        const dbClient = getClient();

        dbClient.query("SELECT 1").then(() => {
            res.json({ message: "hello!" })
        })      
    }
}

export { HelloController }
