require('dotenv').config();
// const csv = require('fast-csv');
// const request = require('request-promise');
const { Client } = require('pg');
const { promiseWrapper, csvReadUrl } = require('./utils');

exports.handler = async (event, context, callback) => {
  const { URL, DB_COLS } = process.env;
  const parsedColArray = JSON.parse(DB_COLS);
  // console.log(parsedColArray);
  // const result = await csvReadUrl(URL);
  // const data = result[0];
  // console.log(result[0]);
};
