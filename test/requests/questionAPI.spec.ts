import { expect, use } from 'chai';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';
use(deepEqualInAnyOrder);
import request from 'supertest';
import { Authentication } from "../../src/models/authentication";
import { Question } from '../../src/models/question';
import { User } from "../../src/models/user";
import { buildAuth, buildExpiredAuth, buildQuestion, buildUser, persistAuth, persistQuestion, persistUser } from "../fixtures";
import { totalQuestionByUser } from '../support/dbUtils';
import { expressApp, resetTables } from "../support/init";

describe('Question API', () => {
    beforeEach(() => resetTables());
    
    describe('Create Question', () => {
        describe('Request with success', () => {
            let user: User;
            let auth: Authentication;

            beforeEach(() => {
                return persistUser(buildUser()).then((userCreated) => {
                    user = userCreated;
                    return user;
                }).then(() => {
                    return persistAuth(buildAuth(user)).then((authCreated) => {
                        auth = authCreated;
                        return auth;
                    });
                });
            });

            it('should returns message to question created with success', () => {
                const title = "title question";
                const description = "description question";

                return request(expressApp)
                .post('/api/question/')
                .set('Authorization', 'Bearer ' + auth.token)
                .send({ title, description })
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response) => { 
                    totalQuestionByUser(user).then((total) => {
                        expect(total).to.be.equal(1);
                        expect(response.body).to.deep.equal({ message: "question created with success" });
                    }); 
                 });
            });
        });

        describe('Validate request', () => {
            describe('send request with no authentication', () => {
                it('should returns an error authentication failed', () => {
                    const auth = "";
                    const title = "title question";
                    const description = "description question";

                    return request(expressApp)
                    .post('/api/question/')
                    .set('Authorization', 'Bearer ' + auth)
                    .send({ title, description })
                    .expect('Content-Type', /json/)
                    .expect(401)
                    .then((response) =>  {
                        expect(response.body).to.deep.equal({ message: "Token is invalid" });
                    });              
                });
            });

            describe('send request with invalid authentication', () => {
                it('should returns an error authentication failed', () => {
                    const auth = "1223333434343334343";
                    const title = "title question";
                    const description = "description question";

                    return request(expressApp)
                    .post('/api/question/')
                    .set('Authorization', 'Bearer ' + auth)
                    .send({ title, description })
                    .expect('Content-Type', /json/)
                    .expect(401)
                    .then((response) =>  {
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
                    const title = "title question"
                    const description = "description question";

                    return request(expressApp)
                    .post('/api/question/')
                    .set('Authorization', 'Bearer ' + auth.token)
                    .send({ title, description })
                    .expect('Content-Type', /json/)
                    .expect(401)
                    .then((response) =>  {
                        expect(response.body).to.deep.equal({ message: "Token is invalid" });
                    });            
                });
            });

            describe('send request with no title and description', () => {
                let user: User;
                let auth: Authentication;

                beforeEach(() => {
                    return persistUser(buildUser()).then((userCreated) => {
                        user = userCreated;
                        return user;
                     }).then(() => {
                        return persistAuth(buildAuth(user)).then((authCreated) => {
                            auth = authCreated;
                            return auth;
                         });
                      });
                });

                it('should returns multiple errors if more than one field is required', () => {
                    const title = ""
                    const description = "";

                    return request(expressApp)
                    .post('/api/question/')
                    .set('Authorization', 'Bearer ' + auth.token)
                    .send({ title, description })
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .then((response) =>  {
                        expect(response.body).to.deep.equal([ "title is required", "description is required" ]);
                    });          
                });
            });

            describe('send request with no title', () => {
                let user: User;
                let auth: Authentication;

                beforeEach(() => {
                    return persistUser(buildUser()).then((userCreated) => {
                        user = userCreated;
                        return user;
                     }).then(() => {
                        return persistAuth(buildAuth(user)).then((authCreated) => {
                            auth = authCreated;
                            return auth;
                         });
                      });
                });

                it('should returns an error a title is required', () => {
                    const title = ""
                    const description = "question description";

                    return request(expressApp)
                    .post('/api/question/')
                    .set('Authorization', 'Bearer ' + auth.token)
                    .send({ title, description })
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .then((response) =>  {
                        expect(response.body).to.deep.equal([ "title is required" ]);
                    });  
                });
            });

            describe('send request with no description', () => {
                let user: User;
                let auth: Authentication;

                beforeEach(() => {
                    return persistUser(buildUser()).then((userCreated) => {
                        user = userCreated;
                        return user;
                     }).then(() => {
                        return persistAuth(buildAuth(user)).then((authCreated) => {
                            auth = authCreated;
                            return auth;
                         });
                      });
                });

                it('should returns an error a description is required', () => {
                    const title = "question title"
                    const description = "";

                    return request(expressApp)
                    .post('/api/question/')
                    .set('Authorization', 'Bearer ' + auth.token)
                    .send({ title, description })
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .then((response) =>  {
                        expect(response.body).to.deep.equal([ "description is required" ]);
                    });   
                });
            });
        });
    });

    describe('Shows questions', () => {
        describe('send request to show questions', () => {
            let user: User;
            let questionsList: Array<Question> = [];

                beforeEach(() => {
                    return persistUser(buildUser()).then((userCreated) => {
                        user = userCreated;
                        return user;
                    }).then((user) => {
                        const promiseArrayList: Promise<Question>[] = [];
                        for (let i = 0; i < 4; i++) {
                            const questionCreated = persistQuestion(buildQuestion(user));
                            promiseArrayList.push(questionCreated);
                        }
                        return Promise.all(promiseArrayList).then((questions) => {
                            questionsList = questions;
                            return questionsList;
                        });
                    });                 
                });  

            it('should returns all questions with title, description, created date and author', () => {
                return request(expressApp)
                .get('/api/questions/')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response) => {
                   const expectedList = questionsList.map((question) => ({ 
                        title: question.title,
                        description: question.description,
                        createdAt: question.createdAt.toISOString(),
                        id: question.id,
                        user: { email: question.user.email, id: question.user.id }        
                    }));
                  expect(response.body).to.deep.equalInAnyOrder(expectedList);       
                });
            });
        });
    });
    
    describe('Shows question details', () => {
        describe('send request to show questions details', () => {
            let user: User;
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
                     });
                });

            it('should returns a question with title, description, created date and author', () => {
                return request(expressApp)
                    .get('/api/question/' + question.id)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .then((response) => {
                        expect(response.body.id).to.deep.equal(question.id);
                        expect(response.body.title).to.deep.equal(question.title);
                        expect(response.body.description).to.deep.equal(question.description);
                        expect(response.body.createdAt).to.deep.equal(question.createdAt.toISOString());
                        expect(response.body.user.id).to.deep.equal(question.user.id);
                        expect(response.body.user.email).to.deep.equal(question.user.email);          
                    })
            })
        })

        describe('send request to show questions unexists', () => {
            it('should returns a question with title, description, created date and author', () => {
                const questionId = 2;

                return request(expressApp)
                    .get('/api/question/' + questionId)
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .then((response) => {
                        expect(response.body).to.deep.equal({ message: "question not found!" });
                    })
            })
        })
    })
});
