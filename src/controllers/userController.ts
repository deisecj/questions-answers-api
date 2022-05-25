import { Request, Response } from 'express';
import { User } from '../models/user';
import { UserRepository } from '../repository/userRepository';
import { BaseController } from './baseController';
import { Validations } from '../validations';

const checkRequest = new Validations;

export class UserController extends BaseController {

    userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        super();
        this.userRepository = userRepository;
    }
    
    signUp(req: Request, res: Response) {
        const { email, password } = req.body;

        checkRequest.validateEmailPassword(email, password)
        .then((errors) => {
            if (errors.length === 0) {
                return this.userRepository.findUser(email)
                .then((user) => {
                    if (user === undefined) {
                        const user = new User({ email: email, password: password });
                        return this.userRepository.save(user)
                        .then(() => res.json({ message: "user created with success" }))
                        .catch((error) => super.handleErrors(res, error));
                    } else {
                        res.status(400).json({ message: "user  already exist" });
                    }
                })              
            } else {
                res.status(400).json(errors);
            }
        });
    }

    signIn(req: Request, res: Response) {

    }
}


