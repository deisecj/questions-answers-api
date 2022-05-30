import { Request, Response } from 'express';
import { AuthenticationRepository } from '../repositories/authenticationRepository';
import { BaseController } from './baseController';

export class AuthenticationController extends BaseController {

    authenticationRepository: AuthenticationRepository;

    constructor(authenticationRepository: AuthenticationRepository) {
        super();
        this.authenticationRepository = authenticationRepository;
    }

    validate(req: Request, res: Response) {
        const authToken = req.headers.authorization;

        let authFormated = "";
        
        if (authToken != undefined) {
            authFormated = authToken.substring(7);
            return this.authenticationRepository.getByToken(authFormated)
            .then((authFound) => {
                if (authFound){
                    res.json({ message: "token validated with success" });
                }
            }).catch((error) => super.handleErrors(res, error))
        } else {
            res.status(400).json({ message: "token is required!" })
        }         
    }
}
