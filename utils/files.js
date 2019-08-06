const path = require('path');
const fs = require('fs-extra');

const FOLDERS = {
  OUTPUT: path.join(__dirname, '..', 'output'),
  ARTISTS: path.join(__dirname, '..', 'Artists'),
  SIGNATURES: path.join(__dirname, '..', 'src', 'signatures'),
};

const bootstrapDirs = () => {
  Object.keys(FOLDERS).forEach(k => {
    fs.mkdirpSync(FOLDERS[k]);
  });

  return Promise.resolve(true);
};

const constructFolder = (fileName, dir) => {
  return path.join(dir, fileName);
};

const getFont = (fontFile) => {
  return constructFolder(fontFile, FOLDERS.SIGNATURES);
}

const getArtist = (artist) => {
  return constructFolder(artist, FOLDERS.ARTISTS);
}

const getAllArtists = () => {
  return fs.readdirSync(FOLDERS.ARTISTS);
}

const createOutput = (fileName, dir = false) => {
  return constructFolder(fileName, dir || FOLDERS.OUTPUT);
}

module.exports = {
  bootstrapDirs,
  getFont,
  getArtist,
  getAllArtists,
  createOutput
};
