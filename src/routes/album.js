const express = require('express');
const albumController = require('../controllers/album')

const router = express.Router();

router.post('/:artistId/albums', albumController.createAlbum);
router.get('/:artistId/albums/', albumController.readAllAlbums);
router.get('/:artistId/albums/:albumId', albumController.readAlbum);
router.patch('/albums/:albumId', albumController.updateAlbum);
router.delete('/albums/:albumId', albumController.deleteAlbum);

module.exports = router;