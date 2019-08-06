const PDFDocument = require('pdfkit');

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

PDFDocument.prototype.arc = function(x, y, radius, startAngle, endAngle) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  let largeArcFlag = '0';
  if (endAngle >= startAngle) {
    largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  } else {
    largeArcFlag = (endAngle + 360.0) - startAngle <= 180 ? '0' : '1';
  }

  // Create an SVG arc path
  const d = [
      'M', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(' ');

  return this.path(d);
};

module.exports = PDFDocument;
