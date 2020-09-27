const { Router } = require('express');
const { Playlist , songs_in_playlist , Song, Album, Artist} = require('../models');
const router = Router();

router.get('/', async (req, res) => {
    try{
        const playlists = await Playlist.findAll();
        if(!playlists){
            return res.status(400).send('no available playlists');
        }
        console.log(playlists)
        res.send(playlists);
    }catch(e){
        res.status(500).send(e.message);
    }
});

router.get('/topPlaylists', async(req, res) => {
    const allPlaylists = await Playlist.findAll({ limit: 20 });
    return res.json(allPlaylists);
  })
  

router.get('/:id', async (req, res) => {
    if(!req.params.id){
        return res.status(400).send('no id in url params');
    }
    try{
        const playlist = await Playlist.findByPk(req.params.id);
        if(!playlist){
            return res.status(400).send('no such playlist');
        }
        res.json(playlist);

    }catch(e){
        res.status(500).send(e.message);
    }
});

router.get('/:id/songs', async (req, res) => {
    if(!req.params.id){
        return res.status(400).send('no id in url params');
    }
    try{
        const songsInPlaylist = await Song.findAll({
            include: [
                {model: Artist ,attributes: ['name','coverImg']},
                {model: Album, attributes: ['name','coverImg']},
                {model: songs_in_playlist ,as:"Playlist" ,attributes: ['playlistId'], where:{playlistId: req.params.id}
            }]
        })

        if(!songsInPlaylist){
            return res.status(400).send('no such songsInPlaylist');
        }
        res.json(songsInPlaylist);

    }catch(e){
        res.status(500).send(e.message);
    }
});

module.exports = router;