import React,{useState,useEffect,useRef} from 'react';
import axios from 'axios';
import network from '../../services/network';
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
        //  if(playingFrom === 'topSongs'){
        //      address = '/top_songs';
        //  }else if(playingFrom === 'Playlist'){
        //      address = `/playlist/${props.id}`;
        //  }else if(playingFrom === 'Album'){
        //     address = `/songs?albumId=${props.id}`;
        // }else if(playingFrom === 'Artist'){
        //     address = `/songs?artistId=${props.id}`;
        // }else{
        //     return;
        // }
        topSongs = qParams.get('topSongs');
        album = qParams.get('albumId');
        artist = qParams.get('artistId');
        playlist = qParams.get('playlistId');
        if(topSongs){
            address = '/api/songs/topSongs';
        }else if(album){
            address = `/api/songs/songsFromAlbum/${album}`;
        }else if(artist){
            address = `/api/songs/songsFromArtist/${artist}`;
        }
        else if(playlist){
            address = `/api/playlists/${playlist}/songs`;
        }
        network.get(address).then((response) => {
            if(response.status === 401){
                return props.setAuthorized(false);
            }
        let playingSong;
        if(playlist){ //playingFrom === 'Playlist'
            playingSong = response.data.find(song => song.id == match.params.id); //props.songId );
        }else{
            playingSong = response.data.find(song => song.id == match.params.id); //props.songId );
        }
        console.log(playingSong);
        playlist?setSongList(response.data) :setSongList(response.data) //playingFrom==='Playlist'
        if(playingSong){
            playingSong.playing=true;
            setUrl(playingSong.youtubeLink);
        }

    })
    },[props])

    function nextUrl(){
        let shuffle = shuffleTrue? Math.floor(Math.random()*songList.length) : null;
        let index = songList.findIndex(song => song.youtubeLink === url);
        if(index === songList.length-1){
            return;
        }
        setUrl(songList[shuffle? shuffle : index+1].youtubeLink)
    }
    function prevUrl(){
        let shuffle = shuffleTrue? Math.floor(Math.random()*songList.length) : null;
        let index = songList.findIndex(song => song.youtubeLink === url);
        if(index === 0){
            return;
        }
        setUrl(songList[shuffle? shuffle : index-1].youtubeLink)
    }
    useEffect(() => {
        if(songList){
            let arr = songList.slice();
            let lastPlayed = arr.find(song => song.playing ===true);
            if(lastPlayed){
                lastPlayed.playing=false;
            }
            let playingSong = arr.find(song => song.youtubeLink === url);
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
                                    return <div className ='listContainer2' style={song.playing ? {backgroundColor:'rgb(78, 78, 78)'}:{}}>
                                        <div className='index'>{index+1}.</div>
                                <div className='play' style={song.playing ? {color:'rgb(148, 34, 34)'}:{backgroundColor:'transparent'}} onClick={()=>{setUrl(song.youtubeLink)}}>{song.playing&&playing?<EqualizerIcon />:<PlayArrowIcon />}</div>
                                        {/* <div onClick={()=>{proper.func(song.youtubeLink.slice(17,song.youtubeLink.length))}}>Play</div> */}
                                        <div className="nameAndArtist">
                                            <div className ='songName' onClick={() => console.log(song)}>{song.name}</div>
                                            <Link className= 'artistOfSong' to={`/Artist/${song.artistId}`}>{song.Artist.name}</Link>
                                            <Link className= 'artistOfSong' to={`/Album/${song.albumId}`}>{song.Album.name}</Link>
                                        </div>
                                            <div className ='songLength' >{song.length.slice(0,5)}</div>
                                    </div>
                                })
                                :<div>
                                        <div className='lyricTitle'>{songList.filter(song => song.youtubeLink === url).map(song=><div style={{margin:'auto', fontWeight:'500', fontSize:'1.2rem', color:'rgb(213, 213, 213)'}}><h1>{song.name}</h1>{song.lyrics}</div>)}</div>
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