import React,{useState,useEffect} from 'react';
import axios from 'axios';
import logo from '../albumCover/logoImage.png';
import MusicModal from './musicModal';
import {Link} from 'react-router-dom';
function Navbar(props){

    return (
          <div class="sidenav">
            <img className='myLogo' src={logo}/>
            <Link to="/">Home</Link>
            <a href="#">Search</a>
            <a href="#">Songs</a>
            <a href="#">Artists</a>
            <a href="#">Playlists</a>
            <MusicModal url={props.link}/>
          </div>
      );
}

export default Navbar;