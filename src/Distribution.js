const fs = require('fs');
const printer = require("printer-lp");
const { exec } = require('child_process');

module.exports = {
  prep: (filePath, cb = () => {}) => {
    const writeStream = fs.createWriteStream(filePath);
    writeStream.on('finish', () => {

      if (process.env.NODE_ENV === 'production') {
        exec(`lp -o fit-to-page ${filePath}`, (err) => {
          if (err) {
            console.error(err);
          } else {
            cb();
          }
        });
        // cb();
      } else {
        cb();
      }
    });

    return writeStream;
  },
  pass: (filePath, cb = () => {}) => {
    const writeStream = fs.createWriteStream(filePath);
    writeStream.on('finish', () => {
      cb();
    });

    return writeStream;
  }
};
