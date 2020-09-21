import React,{useState,useEffect} from 'react';
import axios from 'axios';
import logo from '../albumCover/logoImage.png';
import MusicModal from './musicModal';
import {Link} from 'react-router-dom';
function Navbar2(props){

    return (
          <div className="sidenav2">
            <img className='myLogo2' src={logo}/>
            <div className="sidenav2Container">
              {props.authorized?
              <>
                <Link to="/">Home</Link>
                <a href="#">Search</a>
                <a href="#">Songs</a>
                <a href="#">Artists</a>
                <a href="#">Playlists</a>
                <a onClick={() => {{localStorage.clear(); props.setPlay(false); props.setAuthorized(false)}}} href="#">Log Out</a>
              </>
              :
              <>
                <Link to="/CreateAccount">Create Account</Link>
                <Link to="/Login">Login</Link>
              </>
              }
            </div>
          </div>
      );
}

export default Navbar2;