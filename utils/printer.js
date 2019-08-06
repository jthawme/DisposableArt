const { exec } = require('child_process');

function flattenOptions(opts) {
  const optsStr = [];

  Object.keys(opts).forEach(k => {
    optsStr.push(k);
    optsStr.push(opts[k]);
  });

  return optsStr.filter(v => v != '').join(' ');
}

const printFile = (filePath, opts = {}) => {
  return new Promise((resolve, reject) => {
    const printerOptions = {
      'fit-to-page': '',
      ...opts
    };

    exec(`lp -o ${ flattenOptions(printerOptions) } ${ filePath }`, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(filePath);
      }
    })
  });
};

module.exports = {
  printFile
};
