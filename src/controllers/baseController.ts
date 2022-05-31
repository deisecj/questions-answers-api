import e, { Request, Response } from "express";
import { BusinessError, RecordNotFoundError, UnauthorizedError } from "../errors";
import { Authentication } from "../models/authentication";
import { AuthenticationRepository } from '../repositories/authenticationRepository';

export class BaseController {

    authenticationRepository: AuthenticationRepository;

    constructor(authenticationRepository: AuthenticationRepository) {
        this.authenticationRepository = authenticationRepository;
    }
    
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

    validate(req: Request): Promise<Authentication> {
        const authToken = req.headers.authorization;
        
        if (authToken) {
            const authFormated = authToken.substring(7);
            return this.authenticationRepository
                .getByToken(authFormated)
                .catch((error) => {
                    if (error instanceof RecordNotFoundError) {
                        throw new UnauthorizedError('Token is invalid');
                    } else {
                        throw error;
                    }
                })
        } else {
            return Promise.reject(new UnauthorizedError('Token is invalid'));
        }         
    }
}
