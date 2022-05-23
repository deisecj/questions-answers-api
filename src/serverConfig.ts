import express, { Express, Request, Response } from "express";
import { HelloController } from "./controllers/helloController";

const helloController = new HelloController();

export const initServer = (): Express => {
    const app = express();
    const port = 3000;
    app.use(express.json());

    app.get('/api/hello', (req: Request, res: Response) => {
        return helloController.hello(req, res);
    });

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
    
    return app;
}