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
import Artists from './components/general/Artists';
import Albums from './components/general/Albums';
import Songs from './components/general/Songs';
import { BrowserRouter as Router, Switch, Route, Redirect , useHistory } from 'react-router-dom';
import CreateAccount from './components/userRelated/CreateAccount';
import Login from './components/userRelated/Login';
import network from './services/network';
import ReactGA from 'react-ga';
import createEvent from './services/mixpanel';

function App() {
   //, "album clicked", "song started", "artist clicked" );//{"genre": "hip-hop", "duration in seconds": 42});
  const [link, setLink] = useState();
  const [authorized , setAuthorized] = useState(false);
  const [play , setPlay] = useState(false);
  const [loading, setLoading] = useState(true);
  const [definitions, setDefinitions] = useState({from:'topSongs', songId:'4' , id:'4'});
  const value=0;
  let typingTimer;                //timer identifier
  let doneTypingInterval = 1000;  //time in ms, 5 second for example

  const checkAuthorized = async () => {

    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    if(!name || !token){
      setAuthorized(false);
      return setLoading(false);
    }
    const body = {token, name};
    console.log(body);
    try{
      network.post('/api/users/validUser',{
        token: token,
        name: name
      }).then(response => {
        console.log(response.status);
        if(response.status === 401){
          setAuthorized(false);        
          return setLoading(false);
        }else if(response.data === false){
          setAuthorized(false);
          return setLoading(false);
        }
        setAuthorized(true);
        setLoading(false);
      }).catch(e => {console.error(e); setAuthorized(false); setLoading(false);})
    }catch(e){
      setLoading(false);
      setAuthorized(false)
      console.log(e);
    }  
  }
  useEffect(()=>{
    createEvent("App Launched");
    checkAuthorized();
  },[])

  useEffect(()=>{
    if(authorized){

    }
  },[authorized])

  return (
    loading?<div></div> :
    <Router>
      <div className="App">
        <NavBar2 setAuthorized={setAuthorized} authorized={authorized} link ={link} />
        <div className="main2">
        <PlayerProvider value={{setPlay:setPlay,setDefinitions:setDefinitions}}>
          <Switch>
              <Route path="/" exact >
              {!authorized ? <Redirect to="/Login" />:<HomePage setAuthorized={setAuthorized}/>}
              </Route>
              <Route path="/Artist/:id">
                {!authorized ? <Redirect to="/Login" />:<SpecificArtist setAuthorized={setAuthorized} />}
              </Route>
              <Route path="/Album/:id" >
                {!authorized ? <Redirect to="/Login" />:<SpecificAlbum setAuthorized={setAuthorized}/>}
              </Route>
              <Route path="/Song/:id" >
                {!authorized ? <Redirect to="/Login" />:<SongList setAuthorized={setAuthorized} />}
              </Route>
              <Route path="/Playlist/:id" >
                {!authorized ? <Redirect to="/Login" />:<SpecificPlaylist setAuthorized={setAuthorized} />}
              </Route>
              <Route path="/AllArtists" >
                {!authorized ? <Redirect to="/Login" />:<Artists setAuthorized={setAuthorized} />}
              </Route>
              <Route path="/AllAlbums" >
                {!authorized ? <Redirect to="/Login" />:<Albums setAuthorized={setAuthorized} />}
              </Route>
              <Route path="/AllSongs" >
                {!authorized ? <Redirect to="/Login" />:<Songs setAuthorized={setAuthorized} />}
              </Route>
              <Route path="/CreateAccount" >
                <CreateAccount />
              </Route>
              <Route path="/Login">
                <Login setAuthorized={setAuthorized} authorize={authorized} />
              </Route>
              <Route path="/">
                <>
                <div className='lostPage'>
                  ERROR 404, Page Not Found!
                </div>
                </>
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
