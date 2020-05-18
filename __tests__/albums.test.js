/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');
const { Artist, Album } = require('../src/sequelize');

describe('/albums', () => {
  let artist;
  let album;

  before(async () => {
    try {
      await Artist.sequelize.sync();
      await Album.sequelize.sync();
    } catch (err) {
      console.log(err);
    }
  });

  beforeEach(async () => {
    try {
      await Artist.destroy({ where: {} });
      await Album.destroy({ where: {} });
      artist = await Artist.create({
        name: 'Tame Impala',
        genre: 'Rock',
      });
      album = await Album.create({
        name: 'mock',
        year: 2020,
      });
      artist2 = await Artist.create({
        name: 'mockName',
        genre: 'mockGenre',
      });
      album2 = await Album.create({
        name:'mock2',
        year: 2020
      });
      album.setArtist(artist);
      album2.setArtist(artist2);
    } catch (err) {
      console.log(err);
    }
  });

  describe('POST /artists/:artistId/albums', () => {
    it('creates a new album for a given artist', (done) => {
      request(app)
        .post(`/artists/${artist.id}/albums`)
        .send({
          name: 'InnerSpeaker',
          year: 2010,
        })
        .then((res) => {
          expect(res.status).to.equal(201);

          Album.findByPk(res.body.id, { raw: true }).then((album) => {
            expect(album.name).to.equal('InnerSpeaker');
            expect(album.year).to.equal(2010);
            expect(album.artistId).to.equal(artist.id);
            done();
          });
        });
    });

    it('returns a 404 and does not create an album if the artist does not exist', (done) => {
      request(app)
        .post('/artists/1234/albums')
        .send({
          name: 'InnerSpeaker',
          year: 2010,
        })
        .then((res) => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal('The artist could not be found.');

          Album.findAll().then((albums) => {
            expect(albums.length).to.equal(2);
            done();
          });
        });
    });
  });

  describe('GET artists/:artistId/albums', ()=> {
    it('returns all albums from an artist', (done)=> {
      request(app)
              .get(`/artists/${artist.id}/albums`)
              .then((res) => {
                expect(res.status).to.equal(200);
                expect(res.body.length).to.equal(1);
                done();
              })
    });
    it('returns a 404 and displays an error if the artist does not exist', (done) => {
      request(app)
        .get('/artists/12345/albums/12345')
        .then((res) => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal('The artist could not be found.');
          done();
        });
    });
  });


  describe('GET artists/:artistId/albums/:albumId', ()=> {

    it('returns an album from an artist', (done) => {
      request(app)
              .get(`/artists/${artist.id}/albums/${album.id}`)
              .then((res) => {
                expect(res.status).to.equal(200);
                expect(res.body.name).to.equal(album.name);
                expect(res.body.year).to.equal(album.year);
                expect(res.body.id).to.equal(album.id);
                expect(res.body.artistId).to.equal(artist.id);
                done();
              });
    });
    it('returns an error if the artist is wrong', (done) => {
      request(app)
                .get('/artists/20/albums/22')
                .then((res) => {
                  expect(res.status).to.equal(404);
                  expect(res.body.error).to.equal('The artist could not be found.');
                  done();
                })
    });
    it('returns an error if album is wrong', (done) => {
      request(app)
              .get(`/artists/${artist.id}/albums/1234`)
              .then((res) => {
                expect(res.status).to.equal(404);
                expect(res.body.error).to.equal('The album could not be found');
                done();
              })
    })
    it('returns an error on mismatch', (done) => {
      request(app)
              .get(`/artists/${artist.id}/albums/${album2.id}`)
              .then((res) => {
                expect(res.status).to.equal(404);
                expect(res.body.error).to.equal('The album does not match the artist');
                done();
              })
    })
  });
  describe('PATCH /artists/:albumId', () => {
    it('updates an album name by id', (done) => {
      request(app)
            .patch(`/artists/albums/${album.id}`)
            .send({ name: 'test' })
            .then((res) => {
              expect(res.status).to.equal(200);
              Album.findByPk(album.id, { raw: true }).then(updatedAlbum => {
                expect(updatedAlbum.name).to.equal('test');
                done();
              });
            });
    });
    it('updates an album year by id', (done) => {
      request(app)
            .patch(`/artists/albums/${album.id}`)
            .send({ year: '1999' })
            .then((res) => {
              expect(res.status).to.equal(200);
              Album.findByPk(album.id, { raw: true }).then(updatedAlbum => {
                expect(updatedAlbum.year).to.equal(1999);
                done();
              });
            });
    });
    it('returns an error if album does not exist', (done) => {
      request(app)
            .patch(`/artists/albums/1234`)
            .send({name: 'Styx'})
            .then((res) => {
              expect(res.status).to.equal(404);
              expect(res.body.error).to.equal('The album could not be found.');
              done();
            })
    });
  });
  describe('DELETE /artists/albums/:albumId' , () => {
    it('deletes album  by id', (done) => {
      request(app)
        .delete(`/artists/albums/${album.id}`)
        .then((res) => {
          expect(res.status).to.equal(204);
          Album.findByPk(album.id, { raw: true }).then((deletedAlbum) => {
            expect(deletedAlbum).to.equal(null);
            done();
          });
        });
    });
    it('returns an error if album is invalid', (done) => {
      request(app)
            .delete(`/artists/albums/1234`)
            .then((res) => {
              expect(res.status).to.equal(404);
              expect(res.body.error).to.equal('The album could not be found.');
              done();
            });
    });
  });
});

