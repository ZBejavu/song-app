import React,{useState,useEffect} from 'react';
import './App.css';
import axios from 'axios';
import Navbar from './components/Navbar';
import NavBar2 from './components/NavBar2';
import HomePage from './components/HomePage';
import SpecificArtist from './components/specificResults/Artist';
import SongList from './components/specificResults/SongList';
import SpecificAlbum from './components/specificResults/Album';
import SpecificPlaylist from './components/specificResults/Playlist';
import Login from './components/userRelated/Login';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  const [videoLink, setVideoLink] = useState();
  const [myArtist, setArtist] = useState();
  const [myAlbum, setAlbum] = useState();
  const [link, setLink] = useState();
  const [albumPage, setAlbumPage] = useState();
  const [artistPage, setArtistPage] = useState();
  const [resultObj, setResultObj] = useState({artists: [], albums:[],songs:[]});

  let typingTimer;                //timer identifier
  let doneTypingInterval = 1000;  //time in ms, 5 second for example

  useEffect(() =>{
    axios.get('/artists').then(response =>{
      console.log(response.data);
    });
  }, []);

  useEffect(() => {
    myArtist &&
    axios.get(`/albums?artistId=${myArtist.artist_id}`).then(response =>{
      let albumsArr = response.data;
      axios.get(`/artist/${myArtist.artist_id}`).then(response => {
        console.log('artist', response.data[0]);
        setArtistPage({artist:response.data[0], albums: albumsArr, songs:[]});
      })
      //console.log(Array(resultObj.artists.find(artist=>artist.artist_id === myArtist)));
    });
  },[myArtist])

  useEffect(() => {
    myAlbum &&
    axios.get(`/songs?albumId=${myAlbum.album_id}`).then(response =>{
      console.log(response.data);
      let songsArr = response.data;
      axios.get(`/album/${myAlbum.album_id}`).then(response => {
        console.log(response.data)
        setAlbumPage({artist:[], album: response.data[0], songs: songsArr});
      })
      //setResultObj({artists:resultObj.artists, albums: resultObj.albums, songs: response.data});
    });
  },[myAlbum])

  const generalSearchFunc = (generalSearch) =>{
    if(!generalSearch){
      return setResultObj({artists:[],albums:[],songs:[]})
    }
    axios.get(`/generalSearch?generalSearch=${generalSearch}`).then(response => {
      const artists=[],albums=[],songs=[];
      response.data.forEach(result => {
        (!artists.some(artist => artist.artist_id === result.artist_id) && result.artist.toLowerCase().indexOf(generalSearch.toLowerCase())=== 0)
        && (artists.push({
          artist:result.artist,
          artist_id:result.artist_id ,
          artist_img:result.artist_img,
          artist_uploaded: result.artist_uploaded})
        );

        (!albums.some(album => album.album_id === result.album_id) && result.album.toLowerCase().indexOf(generalSearch.toLowerCase())=== 0 ) 
        && (albums.push({
          album:result.album,
          album_created: result.album_created,
          album_img: result.album_img,
          album_uploaded: result.album_uploaded,
          artist_id: result.artist_id,
          album_id:result.album_id,})
        );
        (result.song.toLowerCase().indexOf(generalSearch.toLowerCase())===0)
         && (songs.push({
            song:result.song,
            song_id:result.song_id,
            song_created: result.song_created,
            song_uploaded: result.song_uploaded,
            artist_id: result.artist_id,
            album_id:result.album_id,
            youtube_link:result.youtube_link})
           );
      });
      setResultObj({artists:artists,albums:albums,songs:songs})
      console.log(response.data);
    })
  }


  // <div style={{backgroundImage: `url(${albumPage.album.album_img})` , backgroundSize: 'contain'}}>
  //   <h2>{albumPage.album.album}</h2>
  //   <h4>Active since: {albumPage.album.album_uploaded}</h4>
  // </div>
  return (
    <Router>
      <div className="App">
        <NavBar2 link ={link} />
        <div class="main2">
          <Switch>
            <Route path="/" exact component={HomePage} />
            <Route path="/Artist/:id" component={SpecificArtist} />
            <Route path="/Album/:id" component={SpecificAlbum} />
            <Route path="/Song/:id" component={SongList} />
            <Route path="/Playlist/:id" component={SpecificPlaylist} />
            <Route path="/Login" component={Login} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
