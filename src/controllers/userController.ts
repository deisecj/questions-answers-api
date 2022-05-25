import { Request, Response } from 'express';
import { User } from '../models/user';
import { UserRepository } from '../repository/userRepository';
import { BaseController } from './baseController';

export class UserController extends BaseController {

    userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        super();
        this.userRepository = userRepository;
    }
    
    signUp(req: Request, res: Response) {
        const { email, password } = req.body;

        const user = new User({ email: email, password: password });

        //TODO: validar email e password
        
        this.userRepository.save(user)
        .then(() => res.json({ message: "user created with success" }))
        .catch((error) => super.handleErrors(res, error));
    }

    signIn(req: Request, res: Response) {

    }
}
