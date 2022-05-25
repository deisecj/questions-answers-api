import { expect } from 'chai';
import request from 'supertest';
import { User } from '../../src/models/user';
import { buildUser } from '../fixtures';
import { totalUserByemail } from '../support/dbUtils';
import { expressApp, resetTables } from "../support/init";

describe('User API', () => {
    beforeEach(() => resetTables());

    describe('SignUp User', () => {
        describe('Request success', () => {
            let user: User;

            beforeEach(() => {
                user = buildUser();
            });

            it.only('should returns message to user created with success', () => {
                const email = user.email;
                const password = user.password;

                return request(expressApp)
                .post('/api/user/signup')
                .send({ email, password })
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response) => { 
                    expect(response.body).to.deep.equal({ message: "user created with success" });
                    totalUserByemail(email).then((total) => expect(total).to.equal(1));
                });
            });
        });

        describe('Validate request', () => {
            describe('request send email user already exist', () => {
                it('should returns an error email already registered', () => {
                });
            });
            describe('request send email and password empty', () => {
                it('should returns multiple errors if more than one field is invalid', () => {

                });
            });
            describe('request send email and password invalid', () => {
                it('should returns multiple errors if more than one field is invalid', () => {

                });
            });
            describe('request send email empty', () => {
                it('should returns an error an email is invalid', () => {

                });
            });
            describe('request send email invalid', () => {
                it('should returns an error an email is invalid', () => {

                });
            });
            describe('request send password empty', () => {
                it('should returns an error a password is invalid', () => {

                });
            });
            describe('request send password invalid', () => {
                it('should returns an error an password is invalid', () => {

                });
            });
            describe('request send password less minimum length', () => {
                it('should returns an error an password is invalid', () => {

                });
            });
        });
    });

    describe('SignIn User', () => {
        describe('Request success', () => {
            it('should returns message to user logged with success', () => {

            });
        });
        describe('Validate request', () => {
            describe('request send email user not exist', () => {
                it('should returns an error email not registered', () => {

                });
            });
            describe('request send email and password empty', () => {
                it('should returns multiple errors if more than one field is invalid', () => {

                });
            });
            describe('request send email and password invalid', () => {
                it('should returns multiple errors if more than one field is invalid', () => {

                });
            });
            describe('request send email empty', () => {
                it('should returns an error an email is invalid', () => {

                });
            });
            describe('request send email invalid', () => {
                it('should returns an error an email is invalid', () => {

                });
            });
            describe('request send password empty', () => {
                it('should returns an error a password is invalid', () => {

                });
            });
            describe('request send password invalid', () => {
                it('should returns an error an password is invalid', () => {

                });
            });
            describe('request send password not registered', () => {
                it('should returns an error an password is invalid', () => {

                });
            });
        });
    });
});
