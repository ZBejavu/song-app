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
                <Link to="/">Home</Link>
                <a href="#">Search</a>
                <a href="#">Songs</a>
                <a href="#">Artists</a>
                <a href="#">Playlists</a>
                <MusicModal url={props.link}/>
            </div>
          </div>
      );
}

export default Navbar2;