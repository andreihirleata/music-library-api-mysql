const express = require('express');
const albumController = require('../controllers/album')

const router = express.Router();

router.post('/:artistId/albums', albumController.createAlbum);

module.exports = router;