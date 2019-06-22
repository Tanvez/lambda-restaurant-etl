const csv = require('fast-csv');
const request = require('request-promise');

const promiseWrapper = promise =>
  promise
    .then(data => ({ ok: true, data }))
    .catch(error =>
      Promise.resolve({
        ok: false,
        error: error.message,
      })
    );
// const csvReadUrl = async url => {
//   const result = [];
//   await csv
//     .parseStream(request(url), { headers: true })
//     .on('error', error => console.error(error))
//     .on('data', data => {
//       console.log('current data: ');
//       console.log(data);
//       // user.
//       result.push(data);
//     })
//     .on('end', () => console.log('done reading'));
//   return result;
// };
const csvReadUrl = url =>
  new Promise((resolve, reject) => {
    const result = [];
    csv
      .parseStream(request(url), { headers: true })
      .transform((data, cb) => {
        const {
          CAMIS: camis,
          DBA: dba,
          BORO: boro,
          BUILDING: building,
          STREET: street,
          ZIPCODE: zipcode,
          PHONE: phone,
          ACTION: action,
          SCORE: score,
          GRADE: grade,
        } = data;
        setImmediate(() =>
          cb(null, [
            camis,
            dba,
            boro,
            building,
            street,
            zipcode,
            phone,
            action,
            score,
            grade,
            data['CUISINE DESCRIPTION'],
            data['INSPECTION DATE'],
            data['VIOLATION CODE'],
            data['VIOLATION DESCRIPTION'],
            data['CRITICAL FLAG'],
            data['GRADE DATE'],
            data['RECORD DATE'],
            data['INSPECTION TYPE'],
          ])
        );
      })
      .on('error', error => reject(error))
      .on('data', data => {
        // console.log('current data: ');
        // console.log(data);
        result.push(data);
      })
      .on('end', () => resolve(result));
  });

module.exports = {
  promiseWrapper,
  // csvReadUrl,
  csvReadUrl,
};
