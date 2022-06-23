import { Request, Response } from "express";
import { BaseController } from "./baseController";
import { Validations } from "../validations";
import { AuthenticationRepository } from "../repositories/authenticationRepository";
import { UserRepository } from "../repositories/userRepository";
import { QuestionRepository } from "../repositories/questionRepository";
import { Answer } from "../models/answer";
import { AnswerRepository } from "../repositories/answerRepository";

const checkRequest = new Validations();

export class AnswerController extends BaseController {

    userRepository : UserRepository;
    questionRepository: QuestionRepository;
    answerRepository: AnswerRepository;

    constructor(authenticationRepository: AuthenticationRepository, userRepository: UserRepository, questionRepository: QuestionRepository, answerRepository: AnswerRepository){
        super(authenticationRepository);
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
    }

    create(req: Request, res: Response) {
        const { description } = req.body;

        return super.validateToken(req)
        .then((auth) => { 
            return checkRequest.validateAnswer(description)
            .then((errors) => {
                if (errors.length === 0) {
                    const  questionID  = parseInt(req.params.idquestion);
                    return this.questionRepository.getByID(questionID).then((question) => {
                        return  this.userRepository.getByEmail(auth.email)
                        .then((user) => {
                            const answer = new Answer({ description: description, user: user, question: question });
                            return this.answerRepository.save(answer)
                            .then(() => res.json({ message: "answer created with success" }));
                        });
                    });                    
                } else {
                    res.status(400).json(errors);
                }
            });
        }).catch((error) => super.handleErrors(res, error)); 
    }
}
