import React,{useState,useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

function App() {
  const [videoLink, setVideoLink] = useState();
  const [songList, setSongList] = useState([]);
  const [artistList, setArtistList] = useState([]);
  const [myArtist, setArtist] = useState();
  const [myAlbum, setAlbum] = useState();
  const [albumsFromArtist, setAlbumsFromArtist] = useState([]);
  useEffect(() =>{
    axios.get('/artists').then(response =>{
      console.log(response.data);
      setArtistList(response.data);
    });
    // axios.get('/songs').then(response =>{
    //   setSongList(response.data);
    // });

  }, []);

  useEffect(() => {
    myArtist &&
    axios.get(`/albums?artistId=${myArtist}`).then(response =>{
      setAlbumsFromArtist(response.data);
    });
  },[myArtist])

  useEffect(() => {
    myAlbum &&
    axios.get(`/songs?albumId=${myAlbum}`).then(response =>{
      setSongList(response.data);
    });
  },[myAlbum])

  console.log(songList);

  return (
    <div className="App">
      <header className="App-header">

          <div>
            {
              artistList.map(
              artist => <button onClick={() => setArtist(artist["artist_id"])}>{artist["name"]}</button>)
            }
          </div>

          <div>
            {
              albumsFromArtist.map(
              album => <button onClick={() => setAlbum(album["album_id"])}>{album["name"]}</button>)
            }
          </div>

          <div>
            {
              songList.map(
              song => <button onClick={() => setVideoLink(song["youtube_link"].slice(17,song["youtube_link"].length))}>{song["title"]}</button>)
            }
          </div>
          {
            videoLink&&
            <iframe width="560" height="315" src={`https://www.youtube.com/embed/${videoLink}`} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          }
      </header>
    </div>
  );
}

export default App;
