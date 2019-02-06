const PDFDocument = require('pdfkit');

module.exports = {
  workHarder: (width, height, writeStream) => {
    const topMargin = 4;
    const signatureZone = 12;

    const doc = new PDFDocument({
      size: [ width, height + topMargin + signatureZone ],
      margins: {
        top: topMargin,
        right: 0,
        bottom: 0,
        left: 0
      }
    });

    doc.pipe(writeStream);
    doc.translate(0, topMargin);

    return doc;
  }
};
