const express = require('express');



const artistRouter = require('./routes/artist');
const albumRouter = require('./routes/album');
const songRouter = require('./routes/song')


const app = express();
app.use(express.json());

app.use('/artists', artistRouter, albumRouter);
app.use('/album', songRouter);




app.use(express.json());

module.exports = app;
