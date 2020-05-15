const express = require('express');
const artistController = require('../controllers/artist');

const router = express.Router();

router.post('/', artistController.createArtist);
router.get('/', artistController.listRecords);
router.get('/:artistId', artistController.findById);
router.patch('/:artistId', artistController.update);

module.exports = router;