const PiCamera = require('pi-camera');

const imagePath = `${ __dirname }/test.jpg`;

const myCamera = new PiCamera({
  mode: 'photo',
  output: imagePath,
  width: 640,
  height: 480,
  nopreview: true,
});

module.exports = {
  name: 'Jonny',
  signature: 'sacramento',
  create: (canvas, width, height, end) => {
    myCamera.snap()
      .then((result) => {
        canvas.image(imagePath, 0, 0, {
          fit: [width, height],
          align: 'center',
          valign: 'center'
        });

        end();
      })
      .catch((error) => {
        // Handle your error
      });
  }
};
