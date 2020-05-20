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

exports.readAllAlbums = (req, res) => {
  const id = parseInt(req.params.artistId, 10);
  Artist.findByPk(id).then(artist => {
    if(!artist) {
      res.status(404).json({error: "The artist could not be found."});
    }else {
      Album.findAll({where: {artistId: artist.id}}).then(album => res.status(200).json(album));
    }
  });
}

exports.readAlbum = (req, res) => {
  const artistId = parseInt(req.params.artistId, 10);
  const albumId = parseInt(req.params.albumId, 10);
  Artist.findByPk(artistId).then(artist => { if(!artist) {
    res.status(404).json({ error: 'The artist could not be found.'} );
  } else {
    Album.findByPk(albumId).then(album => {
      if(!album) {
        res.status(404).json({error: 'The album could not be found'});
      } else {
        Album.findOne({where: {id: albumId}}, ).then(queriedAlbum => 
          { if (queriedAlbum.get('artistId') != artistId) {
            res.status(404).json({error: 'The album does not match the artist'});
          } else {
            res.status(200).json(queriedAlbum) }});
      }
    })
  }
})
}

exports.updateAlbum = (req, res) => {
  const  id  = req.params.albumId;
  Album.update(req.body, { where:  { id }  }).then(([rowsUpdated]) => {
    if (!rowsUpdated) {
      res.status(404).json({ error: 'The album could not be found.' });
    } else {
      res.status(200).json(rowsUpdated);
    }
  });
};

exports.deleteAlbum = (req, res) => {
  const id = req.params.albumId;
  Album.destroy({where: {id} }).then(deletedRow => {
    if(!deletedRow) {
      res.status(404).json({error: 'The album could not be found.'})
    }
    else {
      res.status(204).json(deletedRow);
    }
  });
}