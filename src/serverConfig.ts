import express, { Express, Request, Response } from "express";
import { HelloController } from "./controllers/helloController";
import { UserController } from "./controllers/userController";
import { QuestionController } from "./controllers/questionController";
import getClient from "./persistence/dbClient";
import { UserRepository } from "./repositories/userRepository";
import { AuthenticationRepository } from "./repositories/authenticationRepository";
import { QuestionRepository } from "./repositories/questionRepository";

export const initServer = (): Express => {
    const app = express();
    const port = 3000;
    app.use(express.json());

    const dbClient = getClient();
    const userRepository = new UserRepository(dbClient);
    const authenticationRepository = new AuthenticationRepository(dbClient);
    const questionRepository = new QuestionRepository(dbClient);

    const helloController = new HelloController();
    const userController = new UserController(userRepository, authenticationRepository);
    const questionController = new QuestionController(authenticationRepository, questionRepository, userRepository);

    app.post('/api/user/signup', (req: Request, res: Response) => {
        return userController.signUp(req, res);
    });

    app.post('/api/user/signin', (req: Request, res: Response) => {
        return userController.signIn(req, res);
    });

    app.post('/api/question', (req: Request, res: Response) => {
        return questionController.create(req, res);
    });

    app.get('/api/questions', (req: Request, res: Response) => {
        return questionController.show(req, res);
    });

    app.get('/api/question/:id', (req: Request, res: Response) => {
        return questionController.showDetails(req, res);
    });

    app.get('/api/hello', (req: Request, res: Response) => {
        return helloController.hello(req, res);
    });

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
    
    return app;
}
