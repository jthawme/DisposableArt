// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments
// Return FALSE if the lines don't intersect
function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {

  // Check if none of the lines are of length 0
	if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
		return false
	}

	denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

  // Lines are parallel
	if (denominator === 0) {
		return false
	}

	let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
	let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

  // is the intersection along the segments
	if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
		return false
	}

  // Return a object with the x and y coordinates of the intersection
	let x = x1 + ua * (x2 - x1)
	let y = y1 + ua * (y2 - y1)

	return {x, y}
}

module.exports = {
  name: 'Jonny',
  signature: 'montserrat',
  create: (canvas, width, height, end) => {
    var rectSize = width * ((Math.random() / 2) + 0.2);

    var rectPoints = [
      [(width / 2) - (rectSize / 2), (height / 2) - (rectSize / 2)],
      [(width / 2) + (rectSize / 2), (height / 2) - (rectSize / 2)],
      [(width / 2) + (rectSize / 2), (height / 2) + (rectSize / 2)],
      [(width / 2) - (rectSize / 2), (height / 2) + (rectSize / 2)],
    ];

    var shift = ((width - rectSize) / 4) * ((Math.random() * 0.9) + 0.1);

    rectPoints = rectPoints.map((r, index) => {
      if (index < 2) {
        return [
          r[0] - shift,
          r[1] + shift
        ];
      } else {
        return [
          r[0] + shift,
          r[1] - shift
        ];
      }
    })

    canvas.save();
    rectPoints.forEach(p => {
      canvas.moveTo(0, p[1])
        .lineTo(width, p[1])
        .lineWidth(0.1)
        .stroke();
    });
    canvas.restore();

    rectPoints.forEach((p, index) => {
      if (index === 0) {
        canvas.moveTo(p[0], p[1]);
      } else {
        canvas.lineTo(p[0], p[1]);
      }
    });
    canvas.lineTo(rectPoints[0][0], rectPoints[0][1]);
    canvas.fill('black');

    const intersectPoint = intersect(
      rectPoints[1][0], rectPoints[1][1],
      rectPoints[1][0], height,
      rectPoints[3][0], rectPoints[3][1],
      rectPoints[2][0], rectPoints[2][1],
    );

    if (intersectPoint) {
      canvas.moveTo(rectPoints[0][0], rectPoints[0][1]);
      canvas.lineTo(rectPoints[1][0], rectPoints[1][1]);
      canvas.lineTo(intersectPoint.x, intersectPoint.y);
      canvas.lineTo(rectPoints[3][0], rectPoints[3][1]);
      canvas.lineTo(rectPoints[0][0], rectPoints[0][1]);
      canvas.fill('grey');
    }

    end();
  }
};
