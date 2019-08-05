class Vector {
  constructor({ x = 0, y = 0, magnitude = 1 } = {}) {
    this.x = x;
    this.y = y;
    this.magnitude = magnitude;

    return this;
  }


  /**
   * Sets the x and y position at the same time
   *
   * @param {Number} x
   * @param {Number} y
   */
  set(x, y) {
    this.x = x;
    this.y = y;

    return this;
  }


  /**
   * Sets the magnitude of the vector.
   * This is like how 'far' the vector moves
   * each frame
   *
   * @param {Number} magnitude
   */
  setMag(magnitude) {
    this.normalize();
    this.magnitude = magnitude;

    return this.mult(this.magnitude);
  }


  /**
   * Sets the angle of the vector.
   * This works out the x/y combo to
   * move in a certain direction
   *
   * @param {Number} angle in radians
   */
  setAngle(angle) {
    this.x = Math.cos(angle);
    this.y = Math.sin(angle);

    return this.mult(this.magnitude);
  }


  /**
   * Gets the current angle of the vector
   */
  getAngle() {
    return Math.atan2(this.y, this.x);
  }

  /**
   * Gets the angle of a vector like object
   * from this vector
   *
   * @param {object} Vector
   */
  getAngleOf({ x, y }) {
    return Math.atan2(y - this.y, x - this.y);
  }


  /**
   * Rotates the vector by an angle
   *
   * @param {Number} angle in radians
   */
  rotate(angle) {
    const _angle = this.getAngle() + angle;
    this.setAngle(_angle % (Math.PI * 2));
  }


  /**
   * Returns the vector to a unit of 1
   */
  normalize() {
    return this.mult(1 / this.magnitude);
  }


  /**
   * Multiplies the vector uniformly
   * by a number
   *
   * @param {Number} num
   */
  mult(num) {
    this.x *= num;
    this.y *= num;

    return this;
  }


  /**
   * Divides the vector uniformly
   * by a number
   *
   * @param {Number} num
   */
  div(num) {
    this.x /= num;
    this.y /= num;

    return this;
  }


  /**
   * Subtracts a vector like object
   *
   * @param {object} Vector
   */
  sub({ x, y }) {
    this.x -= x;
    this.y -= y;

    return this;
  }


  /**
   * Adds a vector like object
   *
   * @param {object} Vector
   */
  add({ x, y }) {
    this.x += x;
    this.y += y;

    return this;
  }

  /**
   * Gets distnace between 2 vectors
   *
   * @param {object} Vector
   */
  getDistance({ x, y }) {
    let a = this.x - x;
    let b = this.y - y;
    return Math.sqrt(a * a + b * b);
  }


  /**
   * Sets a random angle for the vector
   */
  randomAngle() {
    return this.setAngle((Math.PI * 2) * Math.random());
  }

  clone() {
    return new Vector({ x: this.x, y: this.y, magnitude: this.magnitude });
  }

  calculatePointFromAngle(angle, dist = 1) {
    let _angle = angle % (Math.PI * 2);
    let x = Math.sin(_angle) * dist + this.x;
    let y = -Math.cos(_angle) * dist + this.y;

    return new Vector({ x, y });
  }

  calculatePerpendicularLine(angleVector, distance = 1, right = false) {
    let opts = right ? { x: -angleVector.y, y: angleVector.x } : { x: angleVector.y, y: -angleVector.x };
    const dist = new Vector(opts).mult(distance);
    return this.clone().add(dist);
  }
}


class Spring {
  constructor(cx, cy, px, py, _angle) {
    this.center = new Vector({ x: cx, y: cy });
    this.position = new Vector({ x: px, y: py });

    this.offset = Math.floor(Math.random() * 10);

    const angle = _angle;
    this.velocity = new Vector().setAngle(angle).setMag(1);

    const parallelDistance = 5;
    this.parallel = [
      this.position.calculatePerpendicularLine(this.velocity, parallelDistance),
      this.position.calculatePerpendicularLine(this.velocity, parallelDistance, true),
    ];
  }

  update(width, height) {
    let shouldChange = false;

    if (Math.random() > 0.95) {
      shouldChange = true;
    }

    if (this.position.getDistance(this.center) > width * 0.45 ||
      this.position.getDistance(this.center) < width * 0.1) {
      shouldChange = true;
    }

    if (shouldChange) {
      this.velocity.rotate(Math.PI);
    }

    if (Math.random() > 0.75) {
      const speed = Math.random();
      this.velocity.setMag(speed);
    }

    this.position.add(this.velocity);
    this.parallel[0].add(this.velocity);
    this.parallel[1].add(this.velocity);
  }
}


const circlePath = (cx, cy, radius, segments = 50, startingAngle = 0) => {
  return arcPath(cx, cy, radius, (Math.PI * 2), segments, startingAngle);
}


const arcPath = (cx, cy, radius, angle, segments = 50, startingAngle = 0) => {
  const angleSegment = angle / segments;
  const angleOffset = startingAngle;
  const path = [];

  for (let i = 0; i < segments; i++) {
    path.push(getPointOnArc(cx, cy, angleOffset + (angleSegment * i), radius));
  }

  return path;
}


const getPointOnArc = (cx, cy, angle, radius) => {
  return {
    x: cx + (Math.cos(angle) * radius),
    y: cy + (Math.sin(angle) * radius / 2)
  }
};


module.exports = {
  name: 'Hoops',
  signature: 'montserrat',
  create: (canvas, width, height, end) => {
    const amt = 10;
    const cx = width / 2;
    const cy = height / 2;
    const circle = circlePath(width / 2, height / 2, width / 6, amt)
      .map((p, idx) => new Spring(cx, cy, p.x, p.y, (idx / amt) * (Math.PI * 2)));

    let hoopsAmt = 50;
    canvas.save();
    canvas.rect(0, 0, width, height).clip()
    canvas.translate(0, (height * 0.3) * -1);

    for (let i = 0; i < 50; i++) {
      for (let i = 0; i < circle.length; i ++) {
        circle[i].update(width, height);
      }
    }

    for (let i = 0; i < hoopsAmt; i++) {
      canvas.save();
      canvas.translate(0, (1 - (i / hoopsAmt)) * (height * 0.6));
      for (let i = 0; i < circle.length; i ++) {
        const { center, position, parallel } = circle[i];
        const { position: nextPosition, parallel: nextParallel } = i == circle.length - 1 ? circle[0] : circle[i + 1];

        circle[i].update(width, height);

        if (i == 0) {
          canvas.moveTo(position.x, position.y);
        }

        canvas.bezierCurveTo(parallel[1].x, parallel[1].y, nextParallel[0].x, nextParallel[0].y, nextPosition.x, nextPosition.y);
      }
      // canvas.fill('white');
      canvas
        .lineWidth(1)
        .fillAndStroke('white', 'black');

      canvas.restore();
    }
    canvas.restore();

    end();
  }
};
