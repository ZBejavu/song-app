import React,{useState,useEffect} from 'react';
import './App.css';
import axios from 'axios';

function AppCopy() {
  const [videoLink, setVideoLink] = useState();
  const [myArtist, setArtist] = useState();
  const [myAlbum, setAlbum] = useState();
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

  return (
    <div className="App">
      <header className="App-header">
        <input className='generalSearch' 
        onKeyUp={(e) => {
          let value = e.target.value;
          typingTimer = setTimeout(() => {
            generalSearchFunc(value);
          }, doneTypingInterval);
          // typingTimer = setTimeout(generalSearchFunc(e.target.value), 5000);
        }}
        onKeyDown={() => {clearTimeout(typingTimer);}} 
        />

        <div className="searchResultContainer">

          <div className="artistResults">
            <div className="titleDiv">Artists</div>
            {
              resultObj.artists.map(
              artist => <button onClick={() => setArtist(artist)}>{artist["artist"]}</button>)
            }
          </div>
          <div className="albumResults">
            <div className="titleDiv">Albums</div>
            {
              resultObj.albums.map(
              album => <button onClick={() => setAlbum(album)}>{album["album"]}</button>)
            }
          </div>

          <div className="songResults">
            <div className="titleDiv">Songs</div>
            {
              resultObj.songs.map(
              song => <button onClick={() => setVideoLink(song["youtube_link"].slice(17,song["youtube_link"].length))}>{song["song"]}</button>)
            }
          </div>

        </div>
        <div className="searchResultContainer">
        {
          artistPage &&
          <div className="artistResults" style={{backgroundColor:'brown'}}>
              <h2>{artistPage.artist.artist}</h2>
              <div style={{width: '50%',paddingTop: '5%'}}>
                <img src={artistPage.artist.artist_img} alt={`${artistPage.artist.artist}Cover`} style={{width:"100%", height:"100%"}} />
              </div>
              <h4>Active since: {artistPage.artist.artist_uploaded}</h4>
              {
                artistPage.albums.map(
                  album => <div style={{height:"40px",width:"100%",display:"flex"}}>
                    <div style={{height:"40px",width:"60%",cursor:"pointer"}} onClick={() => setAlbum(album)}>{album["album"]}</div>
                    <div style={{height:"40px",width:"40%"}}><img src={album.album_img} alt={`${album.album}Cover`} width="40px" height="40px" /></div>
                    </div>)
              }
          </div>
        }

        {
          albumPage &&
          <div className="albumResults" style={{backgroundColor: 'beige'}} >
              <div style={{width: '50%',paddingTop: '5%'}}><img src={albumPage.album.album_img} alt={`${albumPage.album.album}Cover`} style={{width:"100%", height:"100%"}} /></div>
              <h2>{albumPage.album.album}</h2>
              <h4>Active since: {albumPage.album.album_uploaded}</h4>
              {
                albumPage.songs.map(
                  song => <button onClick={() => setVideoLink(song["youtube_link"].slice(17,song["youtube_link"].length))}>{song["song"]}</button>)
              }
          </div>
        }
        </div>

        <div className='videoPlayer'>
          {
            videoLink&&
            <iframe width="560" height="315" src={`https://www.youtube.com/embed/${videoLink}`} onPlay frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          }
        </div>
      </header>
    </div>
  );
}

export default AppCopy;