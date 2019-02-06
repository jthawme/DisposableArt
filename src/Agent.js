// Boring technical stuff
const path = require('path');
const FILE = path.resolve(__dirname, '..', 'art.pdf');
const WIDTH = 135;
const HEIGHT = 192;
const FONTS = {
  sacramento: path.resolve(__dirname, 'signatures', 'Sacramento-Regular.ttf')
};

// The lively characters in this charade
const Intern = require('./Intern.js');
const Distribution = require('./Distribution.js');

// The genius, genius!
const Artiste = require('../Artists/Camera.js');

const distributed = () => {
  console.log('Another job well done');
};

const stream = Distribution.prep(FILE, distributed);
const doc = Intern.workHarder(WIDTH, HEIGHT, stream);

module.exports = {
  makeMoney: () => {
    new Promise((resolve, reject) => {
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
  }
}
