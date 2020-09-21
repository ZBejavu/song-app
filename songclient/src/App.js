import React,{useState,useEffect} from 'react';
import './App.css';
import axios from 'axios';
import Navbar from './components/Navbar';
import NavBar2 from './components/NavBar2';
import { PlayerProvider } from './components/PlayerContext';
import HomePage from './components/HomePage';
import SpecificArtist from './components/specificResults/Artist';
import SongList from './components/specificResults/SongList';
import SpecificAlbum from './components/specificResults/Album';
import SpecificPlaylist from './components/specificResults/Playlist';
import { BrowserRouter as Router, Switch, Route, Redirect , useHistory } from 'react-router-dom';
import CreateAccount from './components/userRelated/CreateAccount';
import Login from './components/userRelated/Login';


function App() {
  const [link, setLink] = useState();
  const [authorized , setAuthorized] = useState(true);
  const [play , setPlay] = useState(false);
  const [definitions, setDefinitions] = useState({from:'topSongs', songId:'4' , id:'4'});
  const value=0;
  let typingTimer;                //timer identifier
  let doneTypingInterval = 1000;  //time in ms, 5 second for example

  const checkAuthorized = async () => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    console.log(name, token);
    try{
      axios.get(`/validUser/${token}?name=${name}`).then(response => {
        if(response.status == '400'){
          return setAuthorized(false);        
        }else if(response.data === false){
          return setAuthorized(false);
        }
        setAuthorized(true);
      })
    }catch(e){
      console.log(e);
    }  
  }
  useEffect(()=>{
    checkAuthorized();
  })

  return (
    <Router>
      <div className="App">
        
        <NavBar2 setAuthorized={setAuthorized} authorized={authorized} link ={link} />
        <div class="main2">
        <PlayerProvider value={{setPlay:setPlay,setDefinitions:setDefinitions}}>
          <Switch>
              <Route path="/" exact >
              {!authorized ? <Redirect to="/Login" />:<HomePage />}
              </Route>
              <Route path="/Artist/:id">
                {!authorized ? <Redirect to="/Login" />:<SpecificArtist />}
              </Route>
              <Route path="/Album/:id" >
                {!authorized ? <Redirect to="/Login" />:<SpecificAlbum />}
              </Route>
              <Route path="/Song/:id" >
                {!authorized ? <Redirect to="/Login" />:<SongList />}
              </Route>
              <Route path="/Playlist/:id" >
                {!authorized ? <Redirect to="/Login" />:<SpecificPlaylist />}
              </Route>
              <Route path="/CreateAccount" >
                <CreateAccount />
              </Route>
              <Route path="/Login">
                <Login setAuthorized={setAuthorized} />
              </Route>
              <Route>
                <div>
                  ERROR 404, Page Not Found!
                </div>
              </Route> 
          </Switch>
          </PlayerProvider>
        </div>
          {play&&<SongList from={definitions.from} songId={definitions.songId} id={definitions.id} />}
      </div>
    </Router>
  );
}

export default App;
