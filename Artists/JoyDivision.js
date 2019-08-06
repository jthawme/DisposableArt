module.exports = {
  name: 'Joy',
  signature: 'montserrat',
  create: (canvas, { width, height }, end) => {
    var size = width;
    var step = width / 30;
    var lines = [];

    // Create the lines
    for(var i = step * 2; i <= height; i += step * 2) {

      var line = [];
      for(var j = -1; j <= size + step; j+= step) {
        var distanceToCenter = Math.abs(j - size / 2);
        var variance = Math.max(size / 2 - 25 - distanceToCenter, 0);
        var random = Math.random() * variance / 2 * -1;
        var point = {x: j, y: i + random};
        line.push(point);
      }
      lines.push(line);
    }

    const drawSection = (line, fill = false) => {
      canvas.moveTo(line[0].x, line[0].y);

      for(var j = 0; j < line.length - 2; j++) {
        var xc = (line[j].x + line[j + 1].x) / 2;
        var yc = (line[j].y + line[j + 1].y) / 2;
        canvas.quadraticCurveTo(line[j].x, line[j].y, xc, yc);
      }

      canvas.quadraticCurveTo(line[j].x, line[j].y, line[j + 1].x, line[j + 1].y);

      canvas.lineTo(width + 20, height);
      canvas.lineTo(-20, height);
      canvas.lineTo(line[0].x, line[0].y);

      // canvas.stroke();
      if (fill) {
        canvas.fill('white');
      } else {
        canvas.stroke();
      }
    };

    canvas.save();

    // Do the drawing
    for(var i = 0; i < lines.length; i++) {
      drawSection(lines[i], true);
      drawSection(lines[i]);
    }

    canvas.rect(0, height - 1, width, 3).fill('white');
    canvas.restore();

    end();
  }
};
