import { Request, Response } from "express";
import { Question } from "../models/question";
import { AuthenticationRepository } from "../repositories/authenticationRepository";
import { QuestionRepository } from "../repositories/questionRepository";
import { BaseController } from "./baseController";
import { UserRepository } from "../repositories/userRepository";
import { Validations } from "../validations";

const checkRequest = new Validations();

export class QuestionController extends BaseController {

    questionRepository: QuestionRepository;
    userRepository : UserRepository;

    constructor(authenticationRepository: AuthenticationRepository, questionRepository: QuestionRepository, userRepository: UserRepository){
        super(authenticationRepository);
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
    }

    create(req: Request, res: Response) {
        const { title, description } = req.body;

        return super.validateToken(req)
        .then((auth) => { 
            return checkRequest.validateQuestion(title, description)
            .then((errors) => {
                if (errors.length === 0) {
                    return  this.userRepository.getByEmail(auth.email)
                    .then((user) => {
                        const question = new Question({ title: title, description: description, user: user });
                        return this.questionRepository.save(question)
                        .then(() => res.json({ message: "question created with success" }));
                     });
                } else {
                    res.status(400).json(errors);
                }
            });
        }).catch((error) => super.handleErrors(res, error));   
    }

    show(req: Request, res: Response) {
        return this.questionRepository.findAll()
        .then((questions) => {
                res.json(questions);
         }).catch((error) => { 
              super.handleErrors(res, error)
         });
    }
}
