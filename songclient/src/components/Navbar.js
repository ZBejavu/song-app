import React,{useState,useEffect} from 'react';
import axios from 'axios';
import logo from '../albumCover/logoImage.png';
import {Link} from 'react-router-dom';
function Navbar(){

    return (
          <div class="sidenav">
            <img className='myLogo' src={logo}/>
            <Link to="/">Home</Link>
            <a href="#">Search</a>
            <a href="#">Songs</a>
            <a href="#">Artists</a>
            <a href="#">Playlists</a>
          </div>
      );
}

export default Navbar;