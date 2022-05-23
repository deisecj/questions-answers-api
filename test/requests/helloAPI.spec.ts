import { expect } from 'chai';
import request from 'supertest';
import { expressApp } from "../support/init";

describe('Hello API', () => {
    it('returns message', () => {
        return request(expressApp)
               .get('/api/hello')
               .expect('Content-Type', /json/)
               .expect(200)
               .then((response) => expect(response.body).to.deep.equals({ message : "hello!" }))
    });
});
