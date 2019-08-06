// @ts-check

// Radial Maze artist
// by https://github.com/ciampo

// Inspired from https://twitter.com/mikebrondbjerg/status/1094697426848567297/photo/1


//==============================================================================
// Fixed Constants
//==============================================================================
// Percentage of how big should the illsutration be
// compared to the smaller dimension.
// E.g.: if the canvas has a portrait aspect ratio, the width is the
// constraining dimension. Hence, the illustration will be 90% of the width.
const OUTER_SIZE_RATIO = 0.85;

// Number of radial layers (i.e. circles)
const NUM_LAYERS = 4;

// Number of lines / segments passing through the center across all layers
// (i.e. lines from the center to the outer radius)
const NUM_SEGMENTS = 7;

const DRAW_BLUEPRINT = false;

//==============================================================================
// "Runtime" constants
//==============================================================================
let canvasDoc;
let canvasSize = {width: 0, height: 0};
let canvasAspectRatio;

let illustrationOuterRadius;
let illustrationInnerRadius;

let strokeWidth;

let generatedConfLayers;

//==============================================================================
// Utils
//==============================================================================
const randomPlusOrMinus = (val, stiffness) =>
    Math.round(val + (val || 1) * (Math.random() - 0.5) / (stiffness || 1));

const rollADie = (faces = 6) => Math.floor(Math.random() * faces) + 1;

const blueprintStroke = (shape) => shape
    .lineWidth(.25)
    .strokeOpacity(.3)
    .dash(2, {space: 2})
    .stroke();

const finalStroke = (shape) => shape
    .lineWidth(strokeWidth)
    .strokeOpacity(1)
    .undash()
    .stroke();

//==============================================================================
// Setup
//==============================================================================

const setup = () => {
  generatedConfLayers = [];
  canvasAspectRatio = canvasSize.width / canvasSize.height;
  illustrationOuterRadius = canvasAspectRatio < 1 ?
      Math.round(canvasSize.width / 2 * OUTER_SIZE_RATIO) :
      Math.round(canvasSize.height / 2 * OUTER_SIZE_RATIO);

  illustrationInnerRadius = Math.round(illustrationOuterRadius / NUM_LAYERS * 1.1);

  strokeWidth = illustrationOuterRadius / 35;

  // Move coordinates system so that the origin (0, 0) is the center of the radial maze.
  canvasDoc.translate(Math.round(canvasSize.width / 2), Math.round(canvasSize.height / 2));
};


//==============================================================================
// Draw the circumference of each layer
//==============================================================================
const drawArcs = (blueprint) => {
  const radiusStep = Math.round(
    (illustrationOuterRadius - illustrationInnerRadius) / NUM_LAYERS);

  for (let layerIndex = 0; layerIndex <= NUM_LAYERS; layerIndex++) {
    const randomLayerIndex = randomPlusOrMinus(layerIndex, layerIndex * 2);

    const radius = illustrationInnerRadius + radiusStep * randomLayerIndex;

    if (blueprint) {
      blueprintStroke(canvasDoc.circle(0, 0, radius));
    }

    // Make sure that the 2 angles are not the same.
    const angle1 = rollADie(NUM_SEGMENTS - 1);
    let angle2 = angle1;
    while (angle2 === angle1) {
      angle2 = rollADie(NUM_SEGMENTS - 1);
    }

    // Do not consider as an occupied verted the staring and ending ones.
    if (angle1 > angle2) {
      angle2 += NUM_SEGMENTS;
    }

    const occupiedIntersections = new Set();
    if (Math.abs(angle2 - angle1) > 1) {
      for (let i = angle1 + 1; i <= angle2 - 1; i += 1) {
        occupiedIntersections.add(i % NUM_SEGMENTS);
      }
    }

    generatedConfLayers.push({
      radius,
      startAngle: angle1 % NUM_SEGMENTS,
      endAngle: angle2 % NUM_SEGMENTS,
      occupiedIntersections,
    });

    const angleStep = 360 / NUM_SEGMENTS;
    finalStroke(
      canvasDoc.arc(0, 0, radius, angleStep * angle1, angleStep * angle2)
    );
  }
}

//==============================================================================
// Draw the segments (straight lines across the circumference)
//==============================================================================
const drawSegments = (blueprint) => {
  if (blueprint) {
    // Draw segment lines from the inner radius to the outer radius
    for (let angleIndex = 0; angleIndex < NUM_SEGMENTS; angleIndex++) {

      // Need to subtract Math.PI / 2 to the andle in order to "align" it with
      // the angle used in the the arc function.
      const angle = Math.PI * 2 * angleIndex / NUM_SEGMENTS - Math.PI / 2;

      blueprintStroke(
        canvasDoc
          .moveTo(
            illustrationInnerRadius * Math.cos(angle),
            illustrationInnerRadius * Math.sin(angle)
          )
          .lineTo(
            illustrationOuterRadius * Math.cos(angle),
            illustrationOuterRadius * Math.sin(angle)
          )
      );
    }
  }

  for (const [index, layerConf] of generatedConfLayers.entries()) {
    if (index >= generatedConfLayers.length - 2) {
      break;
    }

    // Subtracting (Math.PI / 2) in order to offset and "align" the angles
    // with how the arc function works.
    const angle = Math.PI * 2 * layerConf.endAngle / NUM_SEGMENTS - Math.PI / 2;

    const outerRadiusIndex = generatedConfLayers.findIndex((lc, i) => {
      const reachedEnd = i === generatedConfLayers.length - 1;
      const layerIsAfterCurrent = i > index;
      const isBlocked = lc.occupiedIntersections.has(layerConf.endAngle);
      return reachedEnd || (layerIsAfterCurrent && isBlocked);
    });

    const outerRadius = generatedConfLayers[outerRadiusIndex].radius + strokeWidth / 2;
    const innerRadius = layerConf.radius - strokeWidth / 2;

    finalStroke(
      canvasDoc
          .moveTo(
            innerRadius * Math.cos(angle),
            innerRadius * Math.sin(angle)
          )
          .lineTo(
            outerRadius * Math.cos(angle),
            outerRadius * Math.sin(angle)
          )
    );
  }
};

//==============================================================================
// Entrypoint
//==============================================================================
/**
 *
 * @param {PDFDocument} canvas PDFkit document
 * @param {object} options
 * @param {number} options.width Canvas width (px)
 * @param {number} options.height Canvas height (px)
 * @param {function} end Resolve fn to invoke at the end
 */
const create = (canvas, { width, height }, end) => {
  canvasDoc = canvas;
  canvasSize = { width, height };

  // Save the context/reference system before starting to draw.
  canvasDoc.save();

  // Setup variables and draw.
  setup();
  drawArcs(DRAW_BLUEPRINT);
  drawSegments(DRAW_BLUEPRINT);

  // Restore the initial contetx/reference system.
  canvasDoc.restore();

  end();
};

module.exports = {
  name: 'RadialMaze',
  signature: 'sacramento',
  create,
};
