require('dotenv').config()
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const mysql = require('mysql');
app.use(express.static('../songclient/build'));
app.use(express.json());


let mysqlCon = mysql.createConnection({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
  });

mysqlCon.connect(err => {
    if (err) throw err;
    console.log("Connected!");
});

let users = [{"name":"Zach", "password":"pass"}];

app.get('/users' , (req , res) => {
    res.json(users);
})

app.get('/userexists/:name' , async (req , res) => {
    let myName = req.params.name ? req.params.name : null;
    console.log(myName);
    if(myName === null){
        return res.status(400).send('no name in request params');
    }
    let query = `SELECT * FROM user WHERE user.name = '${myName}'`;
    
    mysqlCon.query(query, (error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(error.message);
        };
        if(results.length !== 0){
            return res.send(true);
        }
            res.send(false);
      });
})

app.get('/emailExists', (req,res) => {
    let myEmail = req.query.email ? req.query.email : null;
    if(myEmail == undefined){
        return res.status(400).send('no email in request query');
    }
    let query = `SELECT * FROM user WHERE user.email = '${myEmail}'`;
    
    mysqlCon.query(query, (error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(error.message);
        };
        if(results.length !== 0){
            return res.send(true);
        }
            res.send(false);
      });
})

app.get('/validUser/:token' , async (req , res) => {
    let myToken = req.params.token ? req.params.token : null;
    let myUsername = req.query.name ? req.query.name : null;
    console.log(myToken);
    if(myToken === null){
        return res.status(400).send('no token in request params');
    }
    if(myUsername === null){
        return res.status(400).send('no user in request params');
    }
    let query = `SELECT * FROM user WHERE user.remember_token = '${myToken}' AND user.name = '${myUsername}'`;
    
    mysqlCon.query(query, (error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(error.message);
        }
        
        if(results.length !== 0){
            console.log('sending true')
            return res.send(true);
        }
            res.send(false);
      });
})

app.post('/users' , async (req , res) => {
    try{
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        console.log(salt);
        console.log(hashedPassword);
        const user = { 
            name: req.body.name,
            email: req.body.email, 
            password: hashedPassword,
            is_admin: req.body.is_admin || 0,
            preferences: req.body.preferences,
            remember_token: hashedPassword.slice(0,Math.round(hashedPassword.length/2))
            }
        
        let query = `INSERT INTO user SET ?`;
        
        mysqlCon.query(query , user , (error, results, fields) => {
            if (error) {
                console.error(error);
                return res.send(error.message);
            };
                res.send(true);
          });
    }catch{
        res.status(500).send();
    }
})

app.post('/login' , async (req, res) => {
    
    let myName = req.body.name ? req.body.name : null;
    let myPassword = req.body.password ? req.body.password : null;
    console.log(myName);
    if(myName == null || myPassword == null){
        return res.status(400).send('no name or password in request body');
    }
    let query = `SELECT * FROM user WHERE user.name = '${myName}'`;
    
    mysqlCon.query(query, async (error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(error.message);
        };
        if(results.length === 0){
            return res.send('Cannot find User');
        }
            try{
               if(await bcrypt.compare(myPassword, results[0].password)){
                   res.json({"connection" : true, "token":`${results[0].remember_token}`})
               } else {
                   res.send('Incorrect password')
               }
            } catch {
                res.status(500).send();
            }
      });

})




app.get('/generalSearch', (req , res) => {
    let searchVal = req.query.generalSearch || '';

    let query = `select 
    song.song_id, ar.artist_id, al.album_id,
    al.album, al.album_img, al.album_created, al.album_uploaded,
    ar.artist, ar.artist_img, ar.artist_uploaded,
    song.song, song.youtube_link, song.length, song.song_uploaded, song.lyrics, song.song_created
      from song 
    join album al
    on song.album_id = al.album_id 
    join artist ar
    on ar.artist_id = song.artist_id
    where ar.artist like "%${searchVal}%" or al.album like "%${searchVal}%" or song.song like "%${searchVal}%"`
    mysqlCon.query(query, (error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(error.message);
        };
        res.send(results);
      });
});

app.get('/songs', (req, res) => {
    let query = 'SELECT * FROM song';
    let myId ='';
    let myAlbumId = req.query.albumId? Number(req.query.albumId) :0;
    let myArtistId = req.query.artistId? Number(req.query.artistId) :0;
    if(myAlbumId != 0){
        myId = myAlbumId;
        query = 'SELECT song.*,artist.artist FROM song join artist on artist.artist_id = song.artist_id WHERE song.album_id = ?';
    }else if(myArtistId != 0){
        myId = myArtistId;
        query = 'SELECT song.*,artist.artist,album.album FROM song join artist on artist.artist_id = song.artist_id join album on album.album_id = song.album_id WHERE song.artist_id = ?';
    }
    mysqlCon.query(query,[myId] ,(error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(error.message);
        };
        console.log(results);
        res.send(results);
      });
});

app.get('/albums', (req, res) => {
    let query = 'SELECT * FROM album';
    let myId = req.query.artistId? Number(req.query.artistId) :0;
    console.log(myId);
    if(myId != 0){
        query = 'SELECT * FROM album WHERE artist_id = ?';
    }
    mysqlCon.query(query,[myId] ,(error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(error.message);
        };
        console.log(results);
        res.send(results);
      });
});

app.get('/artists', (req, res) => {
    mysqlCon.query('SELECT * FROM artist', (error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(error.message);
        };
        res.send(results);
      });
});

app.get('/playlist' , (req , res) => {
    mysqlCon.query('SELECT * FROM playlist', (error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(error.message);
        };
        res.send(results);
      });
})


app.get('/song/:id', (req, res) =>{
    mysqlCon.query('SELECT * FROM song WHERE song_id = ?',[req.params.id], (error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(error.message);
        };
        res.send(results);
      });
});

app.get('/album/:id', (req, res) =>{
    mysqlCon.query('SELECT album.*,artist.artist FROM album join artist on artist.artist_id = album.artist_id WHERE album.album_id = ?',[req.params.id], (error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(error.message);
        };
        res.send(results);
      });
});

app.get('/artist/:id', (req, res) =>{
    mysqlCon.query('SELECT * FROM artist WHERE artist_id = ?',[req.params.id], (error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(error.message);
        };
        res.send(results);
      });
});

app.get('/playlist/:id' , (req , res) => {
    mysqlCon.query(`SELECT * FROM playlist where playlist_id =${req.params.id}`, (error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(error.message);
        };
        let playlistObj = {info: results[0], songList:[]};
        let query = `select song.*,album.album,playlist_id from songs_in_playlist
        join song 
        on songs_in_playlist.song_id = song.song_id
        join album 
        on song.album_id = album.album_id
        where songs_in_playlist.playlist_id = ${req.params.id};`
        mysqlCon.query(query, (error, results, fields) => {
            if (error) {
                console.error(error);
                return res.send(error.message);
            };
            playlistObj.songList = results.slice();
            res.send(playlistObj);
          });
      });
})


app.get('/top_songs', (req , res) => {
    mysqlCon.query('SELECT song.*,artist.artist_img,artist.artist FROM song join artist on artist.artist_id = song.artist_id LIMIT 20;', (error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(error.message);
        };
        res.send(results);
      });
})

app.get('/top_albums', (req , res) => {
    mysqlCon.query('SELECT album.*,artist.artist FROM album join artist on artist.artist_id = album.artist_id LIMIT 20', (error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(error.message);
        };
        res.send(results);
      });
})

app.get('/top_artists', (req , res) => {
    mysqlCon.query('SELECT * FROM artist LIMIT 24', (error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(error.message);
        };
        res.send(results);
      });
})

app.get('/top_playlists' , (req , res) => {
    mysqlCon.query('SELECT * FROM playlist LIMIT 20', (error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(error.message);
        };
        res.send(results);
      });
})


app.post('/artist' , (req , res) => {
    if(!req.body){
        return res.send('no body in request')
    }
    const body = req.body;
    let query = 'INSERT INTO artist SET ?';
    mysqlCon.query(query,body, (error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(error.message);
        };
        res.send(results);
      });

})

app.post('/album' , (req , res) => {
    if(!req.body){
        return res.send('no body in request')
    }
    const body = req.body;
    let query = 'INSERT INTO album SET ?';
    mysqlCon.query(query,body, (error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(error.message);
        };
        res.send(results);
      });
})

app.post('/song' , (req , res) => {
    if(!req.body){
        return res.send('no body in request')
    }
    const body = req.body;
    let query = 'INSERT INTO song SET ?';
    mysqlCon.query(query,body, (error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(error.message);
        };
        res.send(results);
      });
})

app.post('/playlist' , (req , res) => {
    if(!req.body){
        return res.send('no body in request')
    }
    const body = req.body;
    let query = 'INSERT INTO playlist SET ?';
    mysqlCon.query(query,body, (error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(error.message);
        };
        res.send(results);
      });
})


app.put('/artist/:id' , (req , res) => {
    if(!req.body){
        return res.send('no body in request')
    }
    const body = req.body;
    let query = `UPDATE artist SET ? WHERE artist_id =${req.params.id}`;
    mysqlCon.query(query,body, (error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(error.message);
        };
        res.send(results);
      });
})

app.put('/album/:id' , (req , res) => {
    if(!req.body){
        return res.send('no body in request')
    }
    const body = req.body;
    let query = `UPDATE album SET ? WHERE album_id =${req.params.id}`;
    mysqlCon.query(query,body, (error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(error.message);
        };
        res.send(results);
      });
})

app.put('/song/:id' , (req , res) => {
    if(!req.body){
        return res.send('no body in request')
    }
    const body = req.body;
    let query = `UPDATE song SET ? WHERE song_id =${req.params.id}`;
    mysqlCon.query(query,body, (error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(error.message);
        };
        res.send(results);
      });
})

app.put('/playlist/:id' , (req , res) => {
    if(!req.body){
        return res.send('no body in request')
    }
    const body = req.body;
    let query = `UPDATE playlist SET ? WHERE playlist_id =${req.params.id}`;
    mysqlCon.query(query,body, (error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(error.message);
        };
        res.send(results);
      });
})


app.delete('/artist/:id' , (req , res) => {
    let query = `DELETE FROM artist WHERE artist_id =${req.params.id}`;
    mysqlCon.query(query,(error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(error.message);
        };
        res.send(results);
      });
})

app.delete('/album/:id' , (req , res) => {
    let query = `DELETE FROM album WHERE album_id =${req.params.id}`;
    mysqlCon.query(query,(error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(error.message);
        };
        res.send(results);
      });
})

app.delete('/song/:id' , (req , res) => {
    let query = `DELETE FROM song WHERE song_id =${req.params.id}`;
    mysqlCon.query(query,(error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(error.message);
        };
        res.send(results);
      });
})

app.delete('/playlist/:id' , (req , res) => {
    let query = `DELETE FROM playlist WHERE playlist_id =${req.params.id}`;
    mysqlCon.query(query,(error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(error.message);
        };
        res.send(results);
      });
})

app.get('*', (req, res) => {
    res.status(404).end();
});


app.listen(3002);