import React,{useState,useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

function App() {
  const [videoLink, setVideoLink] = useState();
  const [songList, setSongList] = useState([]);
  useEffect(() =>{
    axios.get('/songs').then(response =>{
      setSongList(response.data);
    });
  }, []);
  console.log(songList);

  return (
    <div className="App">
      <header className="App-header">
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
