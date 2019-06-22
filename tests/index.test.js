/*
 * Module Dependencies
 */

require('dotenv').config();
const chai = require('chai');
// const { Client } = require('pg');

const { expect } = chai;
const { handler } = require('../index');

describe('Index', () => {
  describe.only('Success', async () => {
    const result = await handler({}, null, (err, res) => err || res);
    console.log(result);
  });
});
