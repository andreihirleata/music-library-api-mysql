const express = require('express');



const artistRouter = require('./routes/artist');
const albumRouter = require('./routes/album');


const app = express();
app.use(express.json());

app.use('/artists', artistRouter, albumRouter);
// app.use('/artists', albumRouter);



app.use(express.json());

module.exports = app;
