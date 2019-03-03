// @ts-check

// Percentage of how big should the illsutration be
// compared to the smaller dimension.
// E.g.: if the canvas has a portrait aspect ratio, the width is the
// constraining dimension. Hence, the illustration will be 90% of the width.
const outerSizeRatio = 0.9;

let canvasDoc;
let canvasSize = {width: 0, height: 0};
let canvasAspectRatio;

let illsutrationOuterRadius;
let illustrationInnerRadius;

// Number of radial layers
let illustrationLayers = 6;

// Number of lines / segments passing through the center across all layers
let illustrationSegments = 7;

const setup = () => {
  canvasAspectRatio = canvasSize.width / canvasSize.height;
  illsutrationOuterRadius = canvasAspectRatio < 1 ?
      Math.round(canvasSize.width / 2 * outerSizeRatio) :
      Math.round(canvasSize.height / 2 * outerSizeRatio);

  illustrationInnerRadius = Math.round(illsutrationOuterRadius / illustrationLayers * 1.1);

  // Move coordinates system so that the origin (0, 0) is the center of the radial maze.
  canvasDoc.translate(Math.round(canvasSize.width / 2), Math.round(canvasSize.height / 2));
};

/**
 *
 * @param {number} val Base value to randomize
 * @param {number} stiffness The higher this value, the weaker the random effect
 */
const randomPlusOrMinus = (val, stiffness) =>
    Math.round(val + (val || 1) * (Math.random() - 0.5) / (stiffness || 1));

const rollADie = (faces = 6) => Math.floor(Math.random() * faces) + 1;

const blueprintStroke = (shape) => shape
    .lineWidth(.25)
    .strokeOpacity(.3)
    .dash(2, {space: 2})
    .stroke();

const finalStroke = (shape) => shape
    .lineWidth(Math.round(illsutrationOuterRadius / 25))
    .strokeOpacity(1)
    .undash()
    .stroke();

const drawArcs = (isBlueprint) => {
  const radiusStep = Math.round(
    (illsutrationOuterRadius - illustrationInnerRadius) / illustrationLayers);

  // Start from index 1, and repeat [illustrationLayers] times,
  // so that also the last outer layer is drawn
  for (let layerIndex = 0; layerIndex <= illustrationLayers; layerIndex++) {
    const randomLayerIndex = randomPlusOrMinus(layerIndex, layerIndex * 2);

    const radius = illustrationInnerRadius + radiusStep * randomLayerIndex;

    if (isBlueprint) {
      blueprintStroke(
        canvasDoc.circle(0, 0, radius)
      );

    } else {
      const angleStep = 360 / illustrationSegments;
      // Make sure that the 2 angles are not the same.
      const angle1 = rollADie(illustrationSegments);
      let angle2 = angle1;
      while (angle2 === angle1) {
        angle2 = rollADie(illustrationSegments);
      }

      finalStroke(
        canvasDoc.arc(0, 0, radius, angleStep * angle1, angleStep * angle2)
      );
    }
  }
}

const drawLines = () => {
  // Draw segment lines from the inner radius to the outer radius
  for (let angle = 0; angle < Math.PI * 2; angle += Math.PI * 2 / illustrationSegments) {
    // Need to subtract Math.PI / 2 to the andle in order to "align" it with
    // the angle used in the the arc function.
    blueprintStroke(
      canvasDoc
        .moveTo(
          illustrationInnerRadius * Math.cos(angle - Math.PI / 2),
          illustrationInnerRadius * Math.sin(angle - Math.PI / 2)
        )
        .lineTo(
          illsutrationOuterRadius * Math.cos(angle - Math.PI / 2),
          illsutrationOuterRadius * Math.sin(angle - Math.PI / 2)
        )
    );
  }
};

const draw = () => {
  // canvasDoc.lineWidth(Math.round(illsutrationOuterRadius / 25));
  canvasDoc.lineWidth(0.25);

  drawArcs(true);
  drawArcs();
  drawLines();
};


/**
 *
 * @param {PDFDocument} canvas PDFkit document
 * @param {number} width Canvas width (px)
 * @param {number} height Canvas height (px)
 * @param {function} end Resolve fn to invoke at the end
 */
const create = (canvas, width, height, end) => {
  canvasDoc = canvas;
  canvasSize = { width, height };

  setup();

  draw();

  end();
};

module.exports = {
  name: 'RadialMaze',
  signature: 'sacramento',
  create: create,
};