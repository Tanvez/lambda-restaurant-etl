require('dotenv').config();
// const csv = require('fast-csv');
// const request = require('request-promise');
const { Client } = require('pg');
const { promiseWrapper, csvReadUrl } = require('./utils');

exports.handler = async (event, context, callback) => {
  const { URL, DB_COLS } = process.env;
  const parsedColArray = JSON.parse(DB_COLS);
  const result = await csvReadUrl(URL);
  const data = result[0];

  const client = new Client({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
  const connection = await promiseWrapper(client.connect());
  if (!connection.ok) {
    console.error(new Error(`Error -->:${connection.error}`));
    return callback({
      statusCode: 500,
      error: `Error -->:${connection.error}`,
    });
  }

  // console.log({ connection });

  const cols = parsedColArray.join(', ');
  let placeholders = [];
  parsedColArray.forEach((e, idx) => placeholders.push(`$${idx + 1}`));
  placeholders = `${placeholders.join(
    ', '
  )}, $11, $12, $13, $14, $15, $16, $17, $18, NOW(), NOW()`;
  console.log({ placeholders, cols });

  const query = `INSERT INTO public."restaurants" (${cols},"cuisineDescription","inspectionDate","violationCode","violationDescription","criticalFlag","gradeDate","recordDate","inspectionType", "createdAt", "updatedAt") VALUES(${placeholders})`;
  const dbRes = await promiseWrapper(
    client
      .query(query, data)
      .then(res => {
        client.end();
        return res;
      })
      .catch(e => {
        console.error(e);
        client.end();
      })
  );
  return callback(null, { dbRes, status: 200 });
};
