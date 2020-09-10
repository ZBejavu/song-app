require('dotenv').config()
const express = require('express');
const app = express();
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

app.get('/songs', (req, res) => {
    let query = 'SELECT * FROM song';
    let myId = req.query.albumId? Number(req.query.albumId) :0;
    console.log(myId);
    if(myId != 0){
        query = 'SELECT * FROM song WHERE album_id = ?';
    }
    mysqlCon.query(query,[myId] ,(error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(err.message);
        };
        console.log(results);
        res.send(results);
      });
    // mysqlCon.query('SELECT * FROM song', (error, results, fields) => {
    //     if (error) {
    //         console.error(error);
    //         return res.send(err.message);
    //     };
    //     res.send(results);
    //   });
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
            return res.send(err.message);
        };
        console.log(results);
        res.send(results);
      });
});

app.get('/artists', (req, res) => {
    mysqlCon.query('SELECT * FROM artist', (error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(err.message);
        };
        res.send(results);
      });
});

app.get('/song/:id', async (req, res) =>{
    mysqlCon.query('SELECT * FROM song WHERE song_id = ?',[req.params.id], (error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(err.message);
        };
        res.send(results);
      });
});

app.get('/album/:id', async (req, res) =>{
    mysqlCon.query('SELECT * FROM album WHERE album_id = ?',[req.params.id], (error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(err.message);
        };
        res.send(results);
      });
});

app.get('/artist/:id', async (req, res) =>{
    mysqlCon.query('SELECT * FROM artist WHERE artist_id = ?',[req.params.id], (error, results, fields) => {
        if (error) {
            console.error(error);
            return res.send(err.message);
        };
        res.send(results);
      });
});

app.listen(3002);