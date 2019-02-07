const fs = require('fs');
const printer = require("printer-lp");

module.exports = {
  prep: (filePath, cb = () => {}) => {
    const writeStream = fs.createWriteStream(filePath);
    writeStream.on('finish', () => {
      const options = {};
      const job = printer.printFile(filePath, options, "distributor");
      job.on("end", cb);
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
