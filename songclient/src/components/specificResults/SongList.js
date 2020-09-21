import React,{useState,useEffect,useRef} from 'react';
import axios from 'axios';
import MusicModal from '../musicModal';
import VideoPlayer from '../react-player/VideoPlayer';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import ControlFooter from '../ControlFooter';
import {Link, useHistory, useLocation, useParams, useRouteMatch} from 'react-router-dom';
function SongList(props){
    const match = useRouteMatch();
    const history = useHistory();
    const location = useLocation();
    const videoElem = useRef(null);
    const [showSongsAndVideo , setShowSongsAndVideo] = useState(false);
    const params = useParams();
    const qParams = new URLSearchParams(location.search);
    const[songList, setSongList] = useState();
    const[url, setUrl] = useState();
    const[showSongs, setShowSongs] = useState(true);
    const[shuffleTrue, setShuffleTrue] = useState(false);
    const[playing, setPlaying] = useState(true);
    const[progress, setProgress] = useState('');
    const [duration, setDuration] = useState();
    useEffect(() => {
        let address;
         let topSongs, artist, album ,playlist;
         let playingFrom = props.from;
         if(playingFrom === 'topSongs'){
             address = '/top_songs';
         }else if(playingFrom === 'Playlist'){
             address = `/playlist/${props.id}`;
         }else if(playingFrom === 'Album'){
            address = `/songs?albumId=${props.id}`;
        }else if(playingFrom === 'Artist'){
            address = `/songs?artistId=${props.id}`;
        }else{
            return;
        }
        // topSongs = qParams.get('topSongs');
        // album = qParams.get('albumId');
        // artist = qParams.get('artistId');
        // playlist = qParams.get('playlistId');
        // if(topSongs){
        //     address = '/top_songs';
        // }else if(album){
        //     address = `/songs?albumId=${album}`;
        // }else if(artist){
        //     address = `/songs?artistId=${artist}`;
        // }
        // else if(playlist){
        //     address = `/playlist/${playlist}`;
        // }
        axios.get(address).then((response) => {
        let playingSong;
        if(playingFrom === 'Playlist'){ //playlist
            playingSong = response.data.songList.find(song => song.song_id == props.songId );//match.params.id); 
        }else{
            playingSong = response.data.find(song => song.song_id == props.songId );//match.params.id); 
        }
        console.log(playingSong);
        playingFrom==='Playlist'?setSongList(response.data.songList) :setSongList(response.data) // playlist
        if(playingSong){
            playingSong.playing=true;
            setUrl(playingSong.youtube_link);
        }

    })
    },[props])

    function nextUrl(){
        let shuffle = shuffleTrue? Math.floor(Math.random()*songList.length) : null;
        let index = songList.findIndex(song => song.youtube_link === url);
        if(index === songList.length-1){
            return;
        }
        setUrl(songList[shuffle? shuffle : index+1].youtube_link)
    }
    function prevUrl(){
        let shuffle = shuffleTrue? Math.floor(Math.random()*songList.length) : null;
        let index = songList.findIndex(song => song.youtube_link === url);
        if(index === 0){
            return;
        }
        setUrl(songList[shuffle? shuffle : index-1].youtube_link)
    }
    useEffect(() => {
        if(songList){
            let arr = songList.slice();
            let lastPlayed = arr.find(song => song.playing ===true);
            if(lastPlayed){
                lastPlayed.playing=false;
            }
            let playingSong = arr.find(song => song.youtube_link === url);
            if(playingSong){
                playingSong.playing=true;
            }
            setSongList(arr);
        }
    },[url])

    return (
        !songList? null :
        <>   
          <div style={showSongsAndVideo?{backgroundColor:'transparent', width:'0%'}:{}} className="songList">
              <div style={showSongsAndVideo?{display:'none', width:'0%'}:{}} className='videoContainer'><VideoPlayer setDuration={setDuration} setProgress={setProgress} myref={videoElem} setPlaying={setPlaying} playing={playing} nextUrl={nextUrl} url={url} /></div>
                {
                    <div style={showSongsAndVideo?{display:'none', width:'0%'}:{}} className="songContainer">
                            <button onClick={()=>setShowSongs(true)}>songs</button><button onClick={()=>setShowSongs(false)}>lyrics</button>  
                            {
                                showSongs?
                                songList.map((song,index) => {
                                    return <div className ='listContainer2' style={song.playing ? {backgroundColor:'rgb(78, 78, 78)'}:{backgroundColor:'transparent'}}>
                                        <div className='index'>{index+1}.</div>
                                <div className='play' style={song.playing ? {color:'rgb(148, 34, 34)'}:{backgroundColor:'transparent'}} onClick={()=>{setUrl(song.youtube_link)}}>{song.playing&&playing?<EqualizerIcon />:<PlayArrowIcon />}</div>
                                        {/* <div onClick={()=>{proper.func(song.youtube_link.slice(17,song.youtube_link.length))}}>Play</div> */}
                                        <div className="nameAndArtist">
                                            <div className ='songName' onClick={() => console.log(song)}>{song.song}</div>
                                            <Link className= 'artistOfSong' to={`/Artist/${song.artist_id}`}>{song.artist}</Link>
                                        </div>
                                            <div className ='songLength' >{song.length.slice(0,5)}</div>
                                    </div>
                                })
                                :<div>
                                        <div className='lyricTitle'>{songList.filter(song => song.youtube_link === url).map(song=><div style={{margin:'auto'}}><h1>{song.song}</h1>{song.lyrics}</div>)}</div>
                                </div>
                            }
                    </div>
                }

          <ControlFooter toshow={showSongsAndVideo} show={setShowSongsAndVideo} videoElem={videoElem} duration={duration} progress={progress} shuffle={setShuffleTrue} isPlaying={playing} setPlaying={setPlaying} prevUrl={prevUrl} nextUrl={nextUrl} />
          </div>
        </>
      );
}

export default SongList;