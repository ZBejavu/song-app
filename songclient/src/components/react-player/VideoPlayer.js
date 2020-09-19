import React,{useState,useEffect,useRef} from 'react';
import './player-style.css';
import ReactPlayer from 'react-player';
function VideoPlayer(props){
    // const match = useRouteMatch();
    // const history = useHistory();
    // const location = useLocation();
    // const params = useParams();
    // const qParams = new URLSearchParams(location.search);
    // console.log('qparam', qParams.get('topSongser'), match.params.id);
    // const [url, setUrl] = useState();
        const url = props.url;
        useEffect(() => {
            props.setPlaying(true);
        },[props.url])
          return (
            <div className='player-wrapper'>
              <ReactPlayer
                ref={props.myref}
                onDuration={(e)=>{console.log('duration',e); props.setDuration(Math.floor(e))}}
                className='react-player'
                url={url}
                width='100%'
                onPause={() => props.setPlaying((playing)=> false)}
                onPlay={() => props.setPlaying((playing)=> true)}
                onProgress={(e)=> props.setProgress(e)}
                playing={props.playing}
                height='100%'
                controls={true}
                onEnded={()=>props.nextUrl()}
              />
            </div>
          )
        }

export default VideoPlayer;