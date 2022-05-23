import { Request, Response } from 'express';

class HelloController {
    hello(req: Request, res: Response) {
        res.json({ message: "hello!" })
    }
}

export { HelloController }
