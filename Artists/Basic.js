module.exports = {
  name: 'Jonny',
  signature: 'sacramento',
  create: (canvas, width, height, end) => {
    canvas.circle(width / 2, height / 2, width / 2)
      .fill('#000');

    canvas.rect(0, 0, width, height)
      .stroke('#000');

    end();
  }
};
