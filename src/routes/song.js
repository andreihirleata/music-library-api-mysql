const express = require('express');
const songController = require('../controllers/song');

const router = express.Router();

router.post('/:albumId/song', songController.createSong);
router.get('/songs/:songId', songController.displaySong);

module.exports = router;