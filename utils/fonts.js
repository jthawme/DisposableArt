const { getFont } = require('./files');

const FONTS = {
  sacramento: getFont('Sacramento-Regular.ttf'),
  dancing: getFont('DancingScript-Regular.ttf'),
  montserrat: getFont('Montserrat-Medium.ttf'),
};

module.exports = {
  getFont: (font) => {
    return font in FONTS ? FONTS[font] : FONTS.dancing;
  }
};
