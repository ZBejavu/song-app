const { Router } = require('express');
const { Artist } = require('../models');
const { Album } = require('../models');
const { Song } = require('../models');


const router = Router();

router.get('/', async (req, res) => {
    // attributes: ['name', 'phoneNumber'],
    // include:['a_songs'],
    // where: {
    //   city: 'telaviv'
    // }
  //const allArtists = await Artist.findAll({});
  //const allSongs = await Song.findAll({});
  //const allAlbums = await Album.findAll();
  const allArtists = await Artist.findAll({});
  return res.json(allArtists);
});

router.get('/topArtists', async(req, res) => {
  const allArtists = await Artist.findAll({ limit: 20 });
  return res.json(allArtists);
})

router.post('/', async (req, res) => {
  let {id,name,coverImg,uploadedAt,createdAt,updatedAt} = req.body;
  if(!createdAt){
    createdAt = new Date();
  }
  if(!uploadedAt){
    uploadedAt = new Date();
  }
  if(!updatedAt){
    updatedAt = new Date();
  }
  const artist = {id, name, coverImg, uploadedAt, createdAt, updatedAt}
  console.log(artist)
  const newArtist = await Artist.create(artist);
  return res.json(newArtist);
});

router.post('/bulkCreate', async (req, res) => {
  //let {id,name,coverImg,uploadedAt,createdAt,updatedAt} = req.body;
  //const artist = {id, name, coverImg, uploadedAt, createdAt, updatedAt}
  //console.log(artist)
  try{
    const newArtist = await Artist.bulkCreate(req.body);
    return res.json(newArtist);
  }catch{
    return res.status(500).send();
  }
});

router.get('/:artistId', async (req, res) => {
  const artist = await Artist.findByPk(req.params.artistId);
  return res.json(artist);
});

router.get('/:artistId/songs', async (req, res) => {
  const artist = await Artist.findByPk(req.params.artistId);
  const songs = await artist.getSongs();
  console.log(songs);
  // console.log('The first phone', allArtists[0].phoneNumber)
  return res.json(songs);
});
router.get('/:artistId/albums', async (req, res) => {
  const artist = await Artist.findByPk(req.params.artistId);
  const albums = await artist.getAlbums();
  // console.log('The first phone', allArtists[0].phoneNumber)
  return res.json(albums);
});

module.exports = router;