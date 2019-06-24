/*
/*
* Module Dependencies
*/
require('dotenv').config();
const chai = require('chai');

const { expect } = chai;
const { promiseWrapper, chunkify } = require('../utils');

describe('chunkify', () => {
  describe('Success', () => {
    const testArr = [];
    while (testArr.length <= 20) {
      testArr.push(testArr.length);
    }
    it('Should chunk data with balance=true', done => {
      const result = chunkify(testArr, 4, true);
      expect(result.length).to.equal(4);
      expect(result[result.length - 1].length).to.equal(5);
      done();
    });
    it('Should chunk data with balance=false', done => {
      const result = chunkify(testArr, 4, false);
      expect(result.length).to.equal(4);
      expect(result[result.length - 1].length).to.not.equal(5);
      done();
    });
  });
  describe('Fail', () => {
    it('Should return empty array', done => {
      const result = chunkify();
      expect(result.length).to.equal(0);
      done();
    });
  });
});

describe('promiseWrapper', () => {
  describe('Success', () => {
    it('Should return with ok=true', async () => {
      const resp = await promiseWrapper(Promise.resolve({ ok: true }));
      expect(resp.ok).to.equal(true);
    });
  });
  describe('Fail', () => {
    it('Should return withok=false', async () => {
      const resp = await promiseWrapper(Promise.reject(new Error('fail')));
      expect(resp.ok).to.equal(false);
    });
  });
});
