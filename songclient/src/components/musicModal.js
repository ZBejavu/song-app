import React,{useState,useEffect} from 'react';
import axios from 'axios';
import logo from '../albumCover/logoImage.png';
import {Link} from 'react-router-dom';
function MusicModal(props){
    const videoLink = props.url;
    const [playPause, setPlayPause] = useState(true);
    const [myPlayer, setMyPlayer] = useState();
    console.log(myPlayer);
    console.log(videoLink);

    return (
        <div className='videoPlayer'>
        {
          videoLink&&
          // <iframe style={{display:'none'}} width="560" height="315" src="https://www.youtube.com/embed/SBjQ9tuuTJQ?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          <iframe width="560" height="315" src={`https://www.youtube.com/embed/${videoLink}?autoplay=1`} onPause={(e)=> {console.log('click'); setMyPlayer(e.target)}} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        }
      </div>
      );
}

export default MusicModal;