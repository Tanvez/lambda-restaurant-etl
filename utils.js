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
          ZIPCODE: zip,
          PHONE: phone,
          ACTION: action,
          SCORE: score,
          GRADE: grade,
        } = data;
        setImmediate(() =>
          cb(null, {
            camis: +camis,
            dba,
            boro,
            building,
            street,
            zip,
            phone,
            action,
            score: +score,
            grade,
            cuisineDescription: data['CUISINE DESCRIPTION'],
            inspectionDate: data['INSPECTION DATE'].length
              ? new Date(data['INSPECTION DATE'])
              : null,
            violationCode: data['VIOLATION CODE'],
            violationDescription: data['VIOLATION DESCRIPTION'],
            criticalFlag: data['CRITICAL FLAG'],
            gradeDate: new Date(data['GRADE DATE']),
            recordDate: new Date(data['RECORD DATE']),
            inspectionType: data['INSPECTION TYPE'],
            createdAt: 'NOW()',
            updatedAt: 'NOW()',
          })
        );
      })
      .on('error', error => reject(error))
      .on('data', data => {
        result.push(data);
      })
      .on('end', () => resolve(result));
  });

// stackoverflow chuck data
// https://stackoverflow.com/questions/8188548/splitting-a-js-array-into-n-arrays

function chunkify(a, n, balanced) {
  if (n < 2) return [a];

  const len = a.length;
  const out = [];
  let i = 0;
  let size;

  if (len % n === 0) {
    size = Math.floor(len / n);
    while (i < len) {
      out.push(a.slice(i, (i += size)));
    }
  } else if (balanced) {
    while (i < len) {
      size = Math.ceil((len - i) / n--);
      out.push(a.slice(i, (i += size)));
    }
  } else {
    n--;
    size = Math.floor(len / n);
    if (len % size === 0) size--;
    while (i < size * n) {
      out.push(a.slice(i, (i += size)));
    }
    out.push(a.slice(size * n));
  }
  return out;
}

module.exports = {
  promiseWrapper,
  csvReadUrl,
  chunkify,
};
