const PDFDocument = require('pdfkit');

module.exports = {
  workHarder: (width, height, writeStream = false, scale = 1) => {
    const topMargin = 4 * scale;
    const signatureZone = 12 * scale;

    const doc = new PDFDocument({
      size: [ (width * scale), (height * scale) + topMargin + signatureZone ],
      margins: {
        top: topMargin,
        right: 0,
        bottom: 0,
        left: 0
      }
    });

    if (writeStream) {
      doc.pipe(writeStream);
    }

    doc.scale(scale, scale);
    doc.translate(0, topMargin);

    return doc;
  }
};
