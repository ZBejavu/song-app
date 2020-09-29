import React,{useState,useEffect} from 'react';
import axios from 'axios';
import logo from '../albumCover/logoImage.png';
import MusicModal from './musicModal';
import {Link, NavLink} from 'react-router-dom';
function Navbar2(props){

    return (
          <div className="sidenav2">
            <img className='myLogo2' src={logo}/>
            <div className="sidenav2Container">
              {props.authorized?
              <>
                <NavLink to="/" exact activeStyle={{color:'#CF1717'}}>Home</NavLink>
                <NavLink to="/AllArtists" activeStyle={{color:'#CF1717'}}>Artists</NavLink>
                <NavLink to="/AllAlbums" activeStyle={{color:'#CF1717'}}>Albums</NavLink>
                <NavLink to="/AllSongs" activeStyle={{color:'#CF1717'}}>Songs</NavLink>
                {/* <a href="#">Search</a>
                <a href="#">Songs</a>
                <a href="#">Playlists</a> */}
                <a onClick={() => {{localStorage.clear(); props.setAuthorized(false)}}} href="#">Log Out</a>
              </>
              :
              <>
                <Link to="/CreateAccount" activeStyle={{color:'#CF1717'}}>Create Account</Link>
                <Link to="/Login" activeStyle={{color:'#CF1717'}}>Login</Link>
              </>
              }
            </div>
          </div>
      );
}

export default Navbar2;