import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import './react-player/player-style.css';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import PauseIcon from '@material-ui/icons/Pause';
function Navbar2(props){
  const [progress,setProgress] = useState();
  const [pressed, setPressed] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState();
  const duration = props.duration;
  useEffect(() => {
    if(!pressed && props.progress){
      setProgress(props.progress.played * 100);
    }
  },[props.progress])
  useEffect(() =>{
    if(!pressed && props.progress){
      console.log(props.progress)
      setPlayedSeconds(Math.round(props.progress.playedSeconds));
    }else if(pressed){
      setPlayedSeconds(Math.round(progress * duration/100))
    }
  },[progress]);
  const secondsToDisplay = `0${Math.floor(playedSeconds/60)}:${playedSeconds%60 < 10 ? '0': ''}${playedSeconds%60}/0${Math.floor(duration/60)}:${duration%60}`
  let inputVal=progress;
    return (
          <div style={props.toshow?{marginTop:'13vh'}:{}} className="controlFooter">
            <div className='sliderContainer'>
              <input 
              onMouseDown={()=>setPressed(true)} 
              onMouseUp={()=>{
                setPressed(false);
                props.videoElem.current.seekTo(playedSeconds)
              }}
              onChange={(e) => setProgress(e.target.value) } 
              value={inputVal} type='range'/>
              <div className='playSeconds'>{secondsToDisplay}</div>
            </div>
            <div className="ControlContainer">
                <ShuffleIcon fontSize='large' color='primary' onClick={(e) => props.shuffle((shuffle)=> !shuffle)} />
                <SkipPreviousIcon fontSize='large' color='primary' onClick={() =>{
                   if(playedSeconds>3){
                     props.videoElem.current.seekTo(0);
                    }else{ 
                    props.prevUrl();}
                   }} />
                {props.isPlaying ? <PauseIcon fontSize='large' color='primary' onClick={() => props.setPlaying((playing) => !playing)} /> 
                :<PlayCircleFilledIcon fontSize='large' color='primary' onClick={() => props.setPlaying((playing) => !playing)} />}
                <SkipNextIcon fontSize='large' color='primary' onClick={() => props.nextUrl()} />
                <button className='controlhide' onClick={()=>props.show(show=>!show)}>showHide</button>
            </div>
          </div>
      );
}

export default Navbar2;