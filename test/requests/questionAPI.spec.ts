import { expect } from 'chai';
import request from 'supertest';
import { Authentication } from "../../src/models/authentication";
import { User } from "../../src/models/user";
import { buildAuth, buildExpiredAuth, buildUser, persistAuth, persistUser } from "../fixtures";
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
})
