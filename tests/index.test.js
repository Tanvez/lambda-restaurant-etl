/*
 * Module Dependencies
 */

require('dotenv').config();
const chai = require('chai');

const { expect } = chai;
const { handler } = require('../index');

describe('Index', () => {
  describe('Success', () => {
    const url = process.env.URL;
    beforeEach(done => {
      process.env.URL =
        'https://drive.google.com/uc?export=download&id=1Li6fEhY4qTWQ0bjvhs6ZRC-3lhHmg8Ct';
      done();
    });
    afterEach(done => {
      process.env.URL = url;
      done();
    });
    it('Should return status code 200', async () => {
      const result = await handler({}, null, (err, res) => err || res);
      expect(result.status).to.equal(200);
    }).timeout(0);
  });
  describe('Fail', () => {
    describe('Invalid url', () => {
      const url = process.env.URL;
      beforeEach(done => {
        delete process.env.URL;
        done();
      });
      afterEach(done => {
        process.env.URL = url;
        done();
      });
      it('Should fail with status code 400', async () => {
        const result = await handler({}, null, (err, res) => err || res);
        expect(result.status).to.equal(400);
      });
    });

    describe('Invalid database credentials', () => {
      const user = process.env.DB_USERNAME;
      const host = process.env.DB_HOST;
      const database = process.env.DB_DATABASE;
      const password = process.env.DB_PASSWORD;
      const port = process.env.DB_PORT;
      const url = process.env.URL;
      beforeEach(done => {
        delete process.env.DB_USERNAME;
        delete process.env.DB_HOST;
        process.env.DB_DATABASE = 'fakedatabase';
        delete process.env.DB_PASSWORD;
        delete process.env.DB_PORT;
        process.env.URL =
          'https://drive.google.com/uc?export=download&id=1Li6fEhY4qTWQ0bjvhs6ZRC-3lhHmg8Ct';
        done();
      });
      afterEach(done => {
        process.env.DB_USERNAME = user;
        process.env.DB_HOST = host;
        process.env.DB_DATABASE = database;
        process.env.DB_PASSWORD = password;
        process.env.DB_PORT = port;
        process.env.URL = url;
        done();
      });
      it('Should fail with status code 400', async () => {
        const result = await handler({}, null, (err, res) => err || res);
        expect(result.status).to.equal(400);
      });
    });
  });
});
