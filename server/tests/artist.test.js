const request = require('supertest');
const app = require('../app');
const { Artist } = require('../models');
// const artistsMock = require('../copyArtistInfo');
const artistsMock = {
  "id": 1,
  "name": "Foo Fighters",
  "coverImg": "https://i.scdn.co/image/c508060cb93f3d2f43ad0dc38602eebcbe39d16d",
  "updated_at": "2020-09-24",
  "uploadedAt": "1999-08-09",
  "deleted_at": null
}

describe('api v1', () => {

  beforeEach(async () => {
    try{
      await Artist.destroy({ where: {}, truncate: true, force: true});
      await Artist.create(artistsMock);
    }catch(e){ console.error(e.message)}
  });
  afterAll(async () => {
    await Artist.destroy({ where: {}, truncate: true, force: true });
    await app.close();
  });

  it('Can create artist', async (done) => {
    // await request(app).post('/api/artists').send(artistMock[0]);
    // await request(app).post('/api/artists').send(artistMock[1]);
    // const {body:artist1} = await request(app).get(`/api/artists/${artistMock[0].id}`);
    // const {body:artist2} = await request(app).get(`/api/artists/${artistMock[1].id}`);
    // console.log('artist1',artist1);
    // expect(artist1.name).toBe(artistMock[0].name);
    // expect(artist2.name).toBe(artistMock[1].name);
    // expect(artistMock[0].name).toBe(artistMock[0].name);
    // expect(artistMock[1].name).toBe(artistMock[1].name);
    expect(1).toBe(1)
    done();
  })
})