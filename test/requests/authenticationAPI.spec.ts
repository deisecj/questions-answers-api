import { expressApp, resetTables } from "../support/init";
import request from 'supertest';
import { Authentication } from "../../src/models/authentication";
import { User } from "../../src/models/user";
import { buildAuth, buildUser, persistAuth, persistUser } from "../fixtures";
import { expect } from "chai";

describe('Authentication API', () => {
    beforeEach(() => resetTables());
    
    describe('Require Authentication', () => {
        describe('when send a request with authentication valid', () => {
            let user: User;
            let authentication: Authentication;

            beforeEach(() => {
                return persistUser(buildUser()).then((userCreated) => {
                    user = userCreated;
                })
                .then(() => {
                    return persistAuth(buildAuth(user)).then((auth) => {
                        authentication = auth;
                        return authentication;
                    })
                });
            });

            it('should returns success', () => {
                return request(expressApp)
                    .post('/api/auth')
                    .set('Authorization', 'Bearer ' + authentication.token)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .then((response) => expect(response.body).to.deep.equal({ message: "token validated with success"}));
            });
        });

        describe('when send a request with authentication invalid', () => {
            it('should returns an error an authentication failed', () => {
                const authentication = "XS2Pqc3w3wQlM3g3SaFh8S8cPFpLLNB71JTcjUQOMXDXFY5tyk";

                return request(expressApp)
                    .post('/api/auth')
                    .set('Authorization', 'Bearer ' + authentication)
                    .expect('Content-Type', /json/)
                    .expect(401)
                    .then((response) => expect(response.body).to.deep.equal({ message: "authentication failed" }));
            });
        });
        
        describe('when send a request no authentication', () => {
            it('should returns an error an authentication is require', () => {
                    return request(expressApp)
                        .post('/api/auth')
                        .expect('Content-Type', /json/)
                        .expect(400)
                        .then((response) => expect(response.body).to.deep.equal({ message: "token is required!" }))
            });
        });
    });
});
