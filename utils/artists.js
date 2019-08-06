const { getArtist: getArtistFile, getAllArtists } = require('./files');

const getRandom = () => {
  const artists = getAllArtists();
  const random = artists[Math.floor(Math.random() * artists.length)];

  return getArtistFile(random);
};

const getArtist = artist => {
  let _artist = `${artist}.js`;
  const artists = getAllArtists();
  return artists.indexOf(_artist) >= 0 ? getArtistFile(_artist) : getArtistFile(artists[0]);
}

module.exports = {
  getArtist,
  getRandom
};
