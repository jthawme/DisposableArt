var baseColor = (Math.random() * 100) + 20;

const getArc = (cx, cy, radius, angle, segments = 50, startingAngle = 0) => {
  const angleSegment = angle / segments;
  const angleOffset = startingAngle ? (Math.PI * 2) * ((startingAngle % 360) / 360) : 0;
  const path = [];

  for (let i = 0; i <= segments; i++) {
      const x = cx + (Math.cos(angleOffset + (angleSegment * i)) * radius);
      const y = cy + (Math.sin(angleOffset + (angleSegment * i)) * radius);

      path.push({ x, y });
  }

  return path;
}

const interpolate = (p1, p2, t) => {
    return {
      x: p1.x + (p2.x - p1.x) * t,
      y: p1.y + (p2.y - p1.y) * t
    };
}

const drawOverlay = (starting, points, circle, canvas, t) => {
  for (let i = starting; i <= points; i++) {
    if (i === starting) {
      canvas.moveTo(circle[i].x, circle[i].y)
    } else {
      canvas.lineTo(circle[i].x, circle[i].y)
    }
  }

  const last = interpolate(circle[points - 1], circle[points], t);

  canvas.lineTo(last.x, last.y);

  canvas.lineTo(circle[starting].x, circle[starting].y);
  canvas.fill([(baseColor * 1.5) + (t * baseColor), (baseColor * 1.5) + (t * baseColor), (baseColor * 1.5) + (t * baseColor)]);
}

module.exports = {
  name: 'Slices',
  signature: 'dancing',
  create: (canvas, { width, height }, end) => {
    const size = width * 0.8;
    const points = Math.round(Math.random() * 12) + 3;
    const seg = (Math.PI * 2) / points;
    const circle = getArc(width / 2, height / 2, size / 2, Math.PI * 2, points, seg * Math.floor(Math.random() * points));

    circle.forEach((p, index) => {
      if (index === 0) {
        canvas.moveTo(p.x, p.y);
      } else {
        canvas.lineTo(p.x, p.y);
      }
    })
    canvas.fill([baseColor, baseColor, baseColor]);

    const starting = Math.floor((points - 2) * Math.random()) + 1;
    const amt = Math.round(Math.random() * 10);

    for (let i = amt; i > 0; i--) {
      drawOverlay(starting, points, circle, canvas, (1 / amt) * i);
    }

    end();
  }
};
