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
  const allAlbums = await Album.findAll({});
  return res.json(allAlbums);
});

router.get('/topAlbums', async(req, res) => {
  const allAlbums = await Album.findAll({include:[{model: Artist, attributes:['name']}], limit: 20 });
  return res.json(allAlbums);
})

router.post('/', async (req, res) => {
  let {id,name,coverImg,uploadedAt,createdAt,updatedAt,artistId} = req.body;
  if(!createdAt){
    createdAt = new Date();
  }
  if(!uploadedAt){
    uploadedAt = new Date();
  }
  if(!updatedAt){
    updatedAt = new Date();
  }
  const album = {
    id,
    name,
    coverImg,
    uploadedAt,
    createdAt,
    updatedAt,
    artistId
  }
  console.log(album)
  const newAlbum = await Album.create(album);
  return res.json(newAlbum);
});

router.post('/bulkCreate', async (req, res) => {
    try{
      const newAlbum = await Album.bulkCreate(req.body);
      return res.json(newAlbum);
    }catch{
      return res.status(500).send();
    }
  });

router.get('/:albumId', async (req, res) => {
  const album = await Album.findByPk(req.params.albumId);
  const {name} = await Artist.findByPk(album.artistId);
  album.dataValues.artistName = name;
  console.log(album);
  return res.json(album);
});

router.get('/fromArtist/:id', async (req, res) => {
  if(!req.params.id){
    return res.status(400).send('no id in url params');
  }
  try{
    const albums = await Album.findAll({where:{artistId : req.params.id}});
    // console.log('The first phone', allArtists[0].phoneNumber)
    return res.json(albums);
  }catch(e){
    res.status(500).send(e.message);
  }
});

router.get('/:albumId/songs', async (req, res) => {
  const album = await Album.findByPk(req.params.albumId);
  const {name} = await Artist.findByPk(album.artistId);
  const songs = await album.getSongs();
  // console.log('The first phone', allArtists[0].phoneNumber)
  return res.json(songs);
});



module.exports = router;