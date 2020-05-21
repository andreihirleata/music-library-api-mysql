const { Album, Artist, Song } = require('../sequelize');

exports.createSong = (req, res) => {
  const albumId = parseInt(req.params.albumId, 10);
  Album.findByPk(albumId).then(album => {
    if (!album) {
      res.status(404).json({ error: 'The album could not be found.' });
    } else {
      const songData = {
        name: req.body.name,
        albumId: album.id,
        artistId: album.artistId,
      };
      Song.create(songData).then(song => res.status(201).json(song));
    }
  });
}

exports.displaySong = (req, res) => {
  const songId = parseInt(req.params.songId, 10);
  Song.findByPk(songId).then(song => {
    if (!song) {
      res.status(404).json({ error: 'The song could not be found.' })
    } else {
      res.status(200).json(song);
    }

  });
}

exports.updateSong = (req, res) => {
  const id = parseInt(req.params.songId, 10);
  Song.update(req.body, { where: { id } }).then(([rowsUpdated]) => {
    if (!rowsUpdated) {
      res.status(404).json({ error: 'The song could not be found.' });
    } else {
      res.status(200).json(rowsUpdated);
    }
  })
}

exports.deleteSong = (req, res) => {
  const id = parseInt(req.params.songId, 10);
  Song.destroy( {where: {id} }).then(deletedSong => {
    if(!deletedSong) {
      res.status(404).json({ error: 'The song could not be found.' });
    } else {
      res.status(204).json(deletedSong);
    }
  });
}