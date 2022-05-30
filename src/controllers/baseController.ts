import { Response } from "express";
import { BusinessError, UnauthorizedError } from "../errors";

export class BaseController {
    
    handleErrors(res: Response, error: Error){
        if (error instanceof BusinessError) {
            res.status(400).json({ message: error.message });
        } else if (error instanceof UnauthorizedError) {
            res.status(401).json({ message: error.message });
        } else {
            console.error("ERROR ON", error);
            res.status(500).json({ message: error.message });
        }       
    }
}
