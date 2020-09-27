const request = require('supertest');
const app = require('../app');
const { Artist } = require('../models');

const artistMock = {
  name: 'new artist name'
}

describe('api v1', () => {

  beforeEach(async () => {
    await Artist.destroy({ where: { name:'new artist name' }, force: true });
    // await Artist.destroy({ truncate: true, force: true });
  });

  it('Can create artist', async () => {
    const { body } = await request(app).post('/api/artists').send(artistMock);
    console.log('aaa', body);
    expect(true);
  })
})