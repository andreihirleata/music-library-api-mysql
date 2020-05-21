const { Artist } = require('../sequelize');

exports.createArtist = (req, res) => {
  Artist.create(req.body).then(user => res.status(201).json(user));
};

exports.listRecords = (req, res) => {
  Artist.findAll().then(artists =>
    res.status(200).json(artists));
};

exports.findById = (req, res) => {
  const artistId = parseInt(req.params.artistId, 10);
  Artist.findByPk(artistId).then(artist => {
    if (!artist) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      res.status(200).json(artist);
    }
  })
    .catch();
};

exports.update = (req, res) => {
  const id = req.params.artistId;
  Artist.update(req.body, { where: { id } }).then(([rowsUpdated]) => {
    if (!rowsUpdated) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      res.status(200).json(rowsUpdated);
    }
  });
};

exports.delete = (req, res) => {
  const id = req.params.artistId;
  Artist.destroy({ where: { id } }).then(deletedRow => {
    if (!deletedRow) {
      res.status(404).json({ error: 'The artist could not be found.' })
    }
    else {
      res.status(204).json(deletedRow);
    }
  });
}