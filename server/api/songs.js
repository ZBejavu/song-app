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
  const allSongs = await Song.findAll({
    include:[{model:Album, attributes:['name','coverImg']},
    {model: Artist, attributes:['name','coverImg']}]
});
  return res.json(allSongs);
});

router.get('/topSongs', async(req, res) => {
  const allSongs = await Song.findAll({include:[{model:Album, attributes:['name','coverImg']},
  {model: Artist, attributes:['name','coverImg']}], limit: 20 });
  return res.json(allSongs);
})

router.post('/', async (req, res) => {
  let {id,name,youtubeLink,length,uploadedAt,createdAt,updatedAt,artistId,lyrics,albumId} = req.body;
  if(!createdAt){
    createdAt = new Date();
  }
  if(!uploadedAt){
    uploadedAt = new Date();
  }
  if(!updatedAt){
    updatedAt = new Date();
  }
  const song = {
    id,
    name,
    youtubeLink,
    length,
    uploadedAt,
    createdAt,
    updatedAt,
    artistId,
    lyrics,
    albumId
  }
  console.log(song)
  const newSong = await Song.create(song);
  return res.json(newSong);
});

router.post('/bulkCreate', async (req, res) => {
    try{
      const newSong = await Song.bulkCreate(req.body);
      return res.json(newSong);
    }catch{
      return res.status(500).send();
    }
  });

router.get('/:songId', async (req, res) => {
  const song = await Song.findByPk(req.params.songId);
  const {name} = await Artist.findByPk(song.artistId);
  const {name:album} = await Album.findByPk(song.artistId);
  song.dataValues.artistName = name;
  song.dataValues.albumName = album;
  return res.json(song);
});

router.get('/songsFromAlbum/:albumId', async (req, res) => {
    const allSongs = await Song.findAll({
        include:[{model:Album, attributes:['name','coverImg']},
        {model: Artist, attributes:['name','coverImg']}],
        where:{'albumId' : req.params.albumId}
    });
    return res.json(allSongs);
  });

  router.get('/songsFromArtist/:artistId', async (req, res) => {
    const allSongs = await Song.findAll({
        include:[{model:Artist, attributes:['name','coverImg']},
        {model: Album, attributes:['name','coverImg']}],
        where:{'artistId' : req.params.artistId}
    });
    return res.json(allSongs);
  });

// router.get('/:albumId/songs', async (req, res) => {
//   const album = await Album.findByPk(req.params.albumId);
//   const songs = await album.getSongs();
//   // console.log('The first phone', allArtists[0].phoneNumber)
//   return res.json(songs);
// });

module.exports = router;