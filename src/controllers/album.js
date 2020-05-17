const { Album, Artist } = require('../sequelize');

exports.createAlbum = (req, res) => {
  const artistId = parseInt(req.params.artistId, 10);
  Artist.findByPk(artistId).then(artist => { if(!artist) {
    res.status(404).json({error: "The artist could not be found."});
  } 
  else {
  Album.create(req.body).then(album => 
                                        album.setArtist(artist).then(finalAlbum => 
                                                                res.status(201).json(finalAlbum)))}});
  
  
};