require('dotenv').config();
const pgp = require('pg-promise')({
  /* initialization options */
  capSQL: true, // capitalize all generated SQL
});
const { promiseWrapper, csvReadUrl, chunkify } = require('./utils');

exports.handler = async (event, context, callback) => {
  const { URL, DB_COLS } = process.env;
  const parsedColArray = JSON.parse(DB_COLS);
  console.info('Extracting data from csv...');
  const {
    ok: csvReadUrlOk,
    data,
    error: csvReadUrlError,
  } = await promiseWrapper(csvReadUrl(URL));
  if (!csvReadUrlOk) {
    console.error(`Error -->:${csvReadUrlError}`);
    return callback({ status: 400, error: csvReadUrlError });
  }
  console.info(
    `Successfully extracted data from csv... there are total of ${
      data.length
    } rows`
  );
  const db = pgp({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  // creates the column headers for inserting data
  const cs = new pgp.helpers.ColumnSet(parsedColArray, {
    table: { table: process.env.DB_DATABASE, schema: 'public' },
  });

  // chunks the data by 10k - function takes <data> <number of arrays you want the chunks split> <balanced>
  const splittedData = chunkify(data, Math.ceil(data.length / 10000), false);

  const { ok, error } = await promiseWrapper(
    db.tx(t => {
      const queries = [];
      for (let i = 0; i < splittedData.length; i++) {
        const query = pgp.helpers.insert(splittedData[i], cs);
        queries.push(t.none(query));
      }
      return t.batch(queries);
    })
  );

  if (!ok) {
    console.error(`Error -->:${error}`);
    return callback({ status: 400, error });
  }
  console.info(`Successfully loaded data into database`);
  return callback(null, { status: 200 });
};
