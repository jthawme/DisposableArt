const argv = require('yargs').argv;
const fs = require('fs-extra');

const PDFDocument = require('./utils/pdfkit');
const Fonts = require('./utils/fonts');
const Files = require('./utils/files');
const Utils = require('./utils/utils');
const Printer = require('./utils/printer');
const Artists = require('./utils/artists');

const { WIDTH, HEIGHT, TOP_MARGIN, SIGNATURE_SPACE } = require('./utils/constants')

/**
 * Runs all functions necessary for generating
 * artworks
 */
function bootstrap() {
  return Promise.all([
    Files.bootstrapDirs()
  ]);
}


/**
 * Creates the file stream that the pdf
 * will be dumped into
 *
 * @param {string} filePath
 * @param {function} onFinished
 */
function createFileStream(filePath, onFinished = () => {}) {
  const writeStream = fs.createWriteStream(filePath);
  writeStream.on('finish', () => onFinished(filePath));
  return Promise.resolve(writeStream);
}


/**
 * Creates the actual pdfkit document
 *
 * @param {options} options
 * @param {number} options.width
 * @param {number} options.height
 * @param {number} options.topMargin
 * @param {number} options.signatureSpace The space assigned to the signature
 * @param {Stream} stream The fs write stream
 */
function createDocument({ width, height, topMargin, signatureSpace }, stream) {
  const doc = new PDFDocument({
    size: [ width, height + topMargin + signatureSpace ],
    margins: {
      top: topMargin,
      right: 0,
      bottom: 0,
      left: 0
    }
  });

  if (stream) {
    doc.pipe(stream);
  }

  doc.translate(0, topMargin);

  return doc;
}


/**
 * Callback for when the document is saved
 *
 * @param {string} filePath
 */
function onFileSaved(filePath) {
  if (Utils.isProduction()) {
    Printer.printFile(filePath)
      .then(() => console.log("Job printed"));
  } else {
    return Promise.resolve(filePath)
      .then(() => console.log("Job completed"));
  }
}


/**
 * Creates the necessary elements for the pdf
 * makes the file stream and the document
 *
 * @returns object
 */
async function createElements() {
  const stream = await createFileStream(Files.createOutput('art.pdf'), onFileSaved);

  const documentOptions = {
    width: WIDTH,
    height: HEIGHT,
    topMargin: TOP_MARGIN,
    signatureSpace: SIGNATURE_SPACE
  };
  const document = await createDocument(documentOptions, stream);

  return { stream, document, documentOptions };
}

/**
 * Adds the signature to the current pdf being generated
 *
 * @param {PDFDocument} document
 * @param {object} artist
 * @param {object} options
 */
function addSignature(document, artist, options) {
  document
    .translate(0, 2)
    .fontSize(6)
    .font(Fonts.getFont(artist.signature))
    .fillColor('#000')
    .fill('#000')
    .text(artist.name, options.width * 0.25, options.height, {
      width: options.width * 0.75,
      align: 'right'
    })
    .text('1/1', 0, options.height, {
      width: options.width * 0.25,
      align: 'left'
    })
    .fill('#000');

  return Promise.resolve({ document, artist, options })
}



// Run the files
bootstrap()
  .then(async () => createElements())
  .then(({ stream, document, documentOptions }) => {
    const artistFile = argv.artist ? Artists.getArtist(argv.artist) : Artists.getRandom();
    const artist = require(artistFile);

    console.log(`Running artist: ${ artist.name }`);

    return new Promise((resolve, reject) => artist.create(document, documentOptions, () => {
      resolve({ document, artist, documentOptions });
    }));
  })
  .then(({ document, artist, documentOptions }) => {
    return addSignature(document, artist, documentOptions);
  })
  .then(({ document, artist, options }) => {
    document.end();
  });
