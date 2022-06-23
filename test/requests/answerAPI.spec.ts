import request from 'supertest';
import { expect } from 'chai';
import { expressApp, resetTables } from "../support/init";
import { buildAnswer, buildAuth, buildExpiredAuth, buildQuestion, buildUser, persistAnswer, persistAuth, persistQuestion, persistUser } from "../fixtures";
import { Question } from "../models/question";
import { User } from "../models/user";
import { Authentication } from '../models/authentication';
import { totalAnswerByUser } from '../support/dbUtils';
import { Answer } from '../models/answer';

describe('Answer API', () => {
    beforeEach(() => resetTables());
    
    describe('Create Answer', () => {
        describe('Request with success', () => { 
            let user: User;
            let userAnswer: User;
            let auth: Authentication;
            let question: Question;

            beforeEach(() => {
                return persistUser(buildUser()).then((userCreated) => {
                    user = userCreated;
                    return user;
                }).then((user) => {
                    return persistQuestion(buildQuestion(user)).then((questionCreated) => {
                        question = questionCreated;
                        return question;
                    });
                }).then(() => {
                    return persistUser(buildUser()).then((userCreated) => {
                        userAnswer = userCreated;
                        return userAnswer;
                    });
                }).then((userAnswer) => {
                    return persistAuth(buildAuth(userAnswer)).then((authCreated) => {
                        auth = authCreated;
                        return auth;
                    });
                });
            });

            it('should returns message to answer created with success', () => {
                const description = "description answer";

                return request(expressApp)
                .post('/api/' + question.id + '/answer/')
                .set('Authorization', 'Bearer ' + auth.token)
                .send({ description })
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response) => {                    
                    return totalAnswerByUser(userAnswer).then((total) => {
                        expect(total).to.be.equal(1);
                        expect(response.body).to.deep.equal({ message: "answer created with success" });
                    });         
                });
            });
        });

        describe('Validate request', () => {
            describe('send request with no authentication', () => {
                it('should returns an error authentication failed', () => {
                    
                    return request(expressApp)
                    .post('/api/:1/answer/')
                    .expect('Content-Type', /json/)
                    .expect(401)
                    .then((response) => {
                        expect(response.body).to.deep.equal({ message: "Token is invalid" });
                    });
                });
            });

            describe('send request with invalid authentication', () => {
                it('should returns an error authentication failed', () => {
                    const auth = "P6391MeF2QCkR9202JqNTWg2PoES3C1IVZmJYBASy3KvtDyAp7";
                    
                    return request(expressApp)
                    .post('/api/:1/answer/')
                    .set('Authorization', 'Bearer ' + auth)
                    .expect('Content-Type', /json/)
                    .expect(401)
                    .then((response) => {
                        expect(response.body).to.deep.equal({ message: "Token is invalid" });
                    });
                });
            });

            describe('send request with expired authentication', () => {
                let user: User;
                let auth: Authentication;

                beforeEach(() => {
                    return persistUser(buildUser()).then((userCreated) => {
                        user = userCreated;
                        return user;
                     }).then(() => {
                        return persistAuth(buildExpiredAuth(user)).then((authCreated) => {
                            auth = authCreated;
                            return auth;
                         });
                      });
                });

                it('should returns an error authentication failed', () => {

                    return request(expressApp)
                    .post('/api/:1/answer/')
                    .set('Authorization', 'Bearer ' + auth)
                    .expect('Content-Type', /json/)
                    .expect(401)
                    .then((response) => {
                        expect(response.body).to.deep.equal({ message: "Token is invalid" });
                    });
                });
            });

            describe('send request with no description', () => {
                let user: User;
                let userAnswer: User;
                let auth: Authentication;
                let question: Question;

                beforeEach(() => {
                    return persistUser(buildUser()).then((userCreated) => {
                        user = userCreated;
                        return user;
                    }).then((user) => {
                        return persistQuestion(buildQuestion(user)).then((questionCreated) => {
                            question = questionCreated;
                            return question;
                        });
                    }).then(() => {
                        return persistUser(buildUser()).then((userCreated) => {
                            userAnswer = userCreated;
                            return userAnswer;
                        });
                    }).then((userAnswer) => {
                        return persistAuth(buildAuth(userAnswer)).then((authCreated) => {
                            auth = authCreated;
                            return auth;
                        });
                    });
                });

                it('should returns error if a field is required', () => {
                    const description = "";

                    return request(expressApp)
                    .post('/api/' + question.id + '/answer/')
                    .set('Authorization', 'Bearer ' + auth.token)
                    .send({ description })
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .then((response) => { 
                        expect(response.body).to.deep.equal([ "description is required" ]);
                    });
                });
            });
        });
    });

    describe('List Answers', () => {
        describe('send request to list answers', () => {
            let user: User;
            let userAnswer: User;
            let question: Question;
            let answerList: Array<Answer> = [];

            beforeEach(() => {
                return persistUser(buildUser()).then((userCreated) => {
                    user = userCreated;
                    return user;
                }).then((user) => {
                    return persistQuestion(buildQuestion(user)).then((questionCreated) => {
                        question = questionCreated;
                        return question;
                    });
                }).then(() => {
                    return persistUser(buildUser()).then((userCreated) => {
                        userAnswer = userCreated;
                        return userAnswer;
                    });
                }).then((userAnswer) => {
                    const promiseArrayList: Promise<Answer>[] = [];
                    for (let i = 0; i < 4; i++) {
                        const answerCreated = persistAnswer(buildAnswer(userAnswer, question));
                        promiseArrayList.push(answerCreated);
                    }
                    return Promise.all(promiseArrayList).then((answers) => {
                        answerList = answers;
                        return answerList;
                    });
                });
            });

            it.only('should returns the answers with description, created date and author', () => {
                
                return request(expressApp)
                .get('/api/' + question.id + '/answers/')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response) => {
                    const expectedList = answerList.map((answer) => ({ 
                        description: answer.description,
                        createdAt: answer.createdAt.toISOString(),
                        id: answer.id,
                        user: { email: answer.user.email, id: answer.user.id }        
                    }));
                    expect(response.body).to.deep.equalInAnyOrder(expectedList);
                });
            });
        });
    });
});
