import React,{useState,useEffect} from 'react';
import axios from 'axios';
import logo from '../albumCover/logoImage.png';
import {Link} from 'react-router-dom';
function musicModal(props){
    const videoLink = props.url;
    console.log(videoLink);

    return (
        <div className='videoPlayer'>
        {
          videoLink&&
          <iframe width="560" height="315" src={`https://www.youtube.com/embed/${videoLink}`} onPlay frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        }
      </div>
      );
}

export default musicModal;