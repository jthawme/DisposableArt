// Boring technical stuff
const blobStream = require('blob-stream');
const path = require('path');
const FILE = path.resolve(__dirname, '..', 'output', 'art.pdf');
const WIDTH = 135;
const HEIGHT = 192;
const FONTS = {
  sacramento: path.resolve(__dirname, 'signatures', 'Sacramento-Regular.ttf'),
  dancing: path.resolve(__dirname, 'signatures', 'DancingScript-Regular.ttf'),
  montserrat: path.resolve(__dirname, 'signatures', 'Montserrat-Medium.ttf'),
};

// The lively characters in this charade
const Intern = require('./Intern.js');
const Distribution = require('./Distribution.js');

const distributed = () => {
  console.log('Another job well done');
};

module.exports = {
  makeMoney: () => {
    const stream = Distribution.prep(FILE, distributed);
    const doc = Intern.workHarder(WIDTH, HEIGHT, stream);
    const Artiste = require('../Artists/Basic.js');

    return new Promise((resolve, reject) => {
      Artiste.create(doc, WIDTH, HEIGHT, resolve);
    })
      .then(() => {
        doc
          .translate(0, 2)
          .fontSize(6)
          .font(FONTS[Artiste.signature])
          .text(Artiste.name, WIDTH * 0.25, HEIGHT, {
            width: WIDTH * 0.75,
            align: 'right'
          })
          .text('1/1', 0, HEIGHT, {
            width: WIDTH * 0.25,
            align: 'left'
          })
          .fill('#000');
        doc.end();
      });
  },
  overShoulder: (artist) => {
    let res;
    const p = new Promise((resolve, reject) => {
      res = resolve;
    });

    const stream = Distribution.prep(FILE, () => {
      res(FILE);
    });
    const doc = Intern.workHarder(WIDTH, HEIGHT, stream, 2);
    const Artiste = require(`../Artists/${artist}.js`);

    return new Promise((resolve, reject) => {
      Artiste.create(doc, WIDTH, HEIGHT, resolve);
    })
      .then(() => {
        doc
          .translate(0, 2)
          .fontSize(6)
          .font(FONTS[Artiste.signature])
          .text(Artiste.name, WIDTH * 0.25, HEIGHT, {
            width: WIDTH * 0.75,
            align: 'right'
          })
          .text('1/1', 0, HEIGHT, {
            width: WIDTH * 0.25,
            align: 'left'
          })
          .fill('#000');
        doc.end();

        return p;
      });
  }
}
