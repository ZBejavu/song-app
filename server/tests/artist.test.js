const request = require('supertest');
const app = require('../app');
const { Artist } = require('../models');

const artistMock = [
  {
    id:1,
    name: 'armando1'
  },
  {
    id:3,
    name: 'armando3'
  }
]

describe('api v1', () => {

  beforeEach(async () => {
    await Artist.destroy({ where: { name:['new artist name','armando1','armando3'] }, force: true });
    // await Artist.destroy({ truncate: true, force: true });
  });

  it('Can create artist', async () => {
    await request(app).post('/api/artists').send(artistMock[0]);
    await request(app).post('/api/artists').send(artistMock[1]);
    const {body:artist1} = await request(app).get(`/api/artists/${artistMock[0].id}`);
    const {body:artist2} = await request(app).get(`/api/artists/${artistMock[1].id}`);
    console.log('artist1',artist1);
    expect(artist1.name).toBe(artistMock[0].name);
    expect(artist2.name).toBe(artistMock[1].name);
  })
})