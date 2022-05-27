import { Request, Response } from 'express';
import { User } from '../models/user';
import { Validations } from '../validations';
import { UserRepository } from '../repositories/userRepository';
import { AuthenticationRepository } from '../repositories/authenticationRepository';
import { BaseController } from './baseController';
import { BusinessError, RecordNotFoundError } from '../errors';

const checkRequest = new Validations();

export class UserController extends BaseController {

    userRepository: UserRepository;
    authenticationRepository: AuthenticationRepository;

    constructor(userRepository: UserRepository, authencationRepository: AuthenticationRepository) {
        super();
        this.userRepository = userRepository;
        this.authenticationRepository = authencationRepository;
    }
    
    signUp(req: Request, res: Response) {
        const { email, password } = req.body;

        checkRequest.validateSignUp(email, password)
        .then((errors) => {
            if (errors.length === 0) {
                return this.userRepository.findUserbyEmail(email)
                .then((user) => {
                    console.log("ksdddd user", user)
                    if (user) {
                        res.status(400).json({ message: "user already exist" });
                    } else {
                        const user = new User({ email: email, password: password });
                        return this.userRepository.save(user)
                        .then(() => res.json({ message: "user created with success" }))
                    }
                });            
            } else {
                res.status(400).json(errors);
            }
        }).catch((error) => super.handleErrors(res, error));  
    }

    signIn(req: Request, res: Response) {
        const { email, password } = req.body;

        console.log("valores enviados no reques teste", {email, password})

        checkRequest.validateSignIn(email, password)
        .then((errors) => {
            if (errors.length === 0) {
                return this.userRepository.getByEmail(email)
                .then((user) => {
                    return user.signIn(password).then((auth) => {
                        return this.authenticationRepository.save(auth)
                            .then(() => res.json(auth)); 
                    })
                }).catch((error) => {
                    if (error instanceof RecordNotFoundError) {
                        res.status(400).json({ message: "email or password is invalid" }) 
                    } else {
                        throw error;
                    }
                });
            } else {
                res.status(400).json(errors);
            }
        }).catch((error) => super.handleErrors(res, error));                  
    }
}
