const axios = require('axios');

var word;
var letters;
var fontSize;
var strokeSize;
var shadowDepth;
var cWidth;
var cHeight;

var modX;
var modY;

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function getWord(length = 4) {
  return axios.get('https://www.randomwordgenerator.com/json/words.json')
    .then(res => {
      const words = res.data.data.map(d => d.word);
      shuffle(words);

      return words.find(w => w.length === length);
    });
}

function random(num) {
  return Math.round(num * Math.random());
}

function setup() {
	letters = word.split('');

	fontSize = cHeight / (letters.length);
	strokeSize = fontSize / 10;
	shadowDepth = random(40) + 10;

	//modX = random(-15, 15) / 10;
	//modY = random(-15, 15) / 10;
	modX = 0.25;
	modY = 0.25;
}

function draw(canvas) {
	letters.forEach((l, index) => {
    const pos = getPos(index, letters.length);
		shadowLetter(canvas, l, pos.x, pos.y);
	});
}

function getPos(idx, len) {
	return {
		x: random(cWidth - fontSize),
		y: ((cHeight - (strokeSize)) / len) * idx
	}
}

function shadowLetter(canvas, char, x, y) {
	for (let i = shadowDepth; i >= 0; i--) {
		drawLetter(canvas, char, x + (i * modX), y + (i * modY), (i === 0));
	}
}

function drawLetter(canvas, char, x, y, alt = false) {
  canvas
    .font('Helvetica-Bold')
    .fontSize(fontSize)
    .strokeColor('black')
    .fillColor(alt ? 'white' : 'black')
    .text(char, x, y, {
      fill: true,
      stroke: true
    });
}


module.exports = {
  name: 'Words',
  signature: 'montserrat',
  create: (canvas, { width, height }, end) => {
    cWidth = width;
    cHeight = height * 0.9;

    getWord(random(4) + 3)
      .then(_word => {
        word = _word.toUpperCase();
        setup();
        draw(canvas);
        end();
      });
  }
};
