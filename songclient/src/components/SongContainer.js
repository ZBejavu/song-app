import React,{useState,useEffect} from 'react';
import axios from 'axios';
import {Link, useLocation} from 'react-router-dom';
import './specificResults/Specific.css';
function Album(props){
    const[songArray , setSongArray] = useState();
    const location = useLocation();
    console.log(location.pathname);
    console.log(songArray)
    useEffect(() => {
        if(!props.songArray){
            return;
        }
        setSongArray(props.songArray);
    },[props.songArray])
    return (
        !songArray ? null 
        :
                <div className="songContainer2">    
                        {
                            songArray.map((song,index) => {
                                return <div className ='listContainer2'>
                                    {/* <div onClick={()=>{proper.func(song.youtube_link.slice(17,song.youtube_link.length))}}>Play</div> */}
                                    <div className='index'>{index+1}.</div>
                                            <div className="nameAndArtist">
                                                {
                                                    location.pathname.indexOf('Playlist') !== -1 
                                                    ?<Link className ='songName' to={`/Song/${song.song_id}?playlistId=${song.playlist_id}`}>{song.song}</Link>
                                                    :location.pathname.indexOf('Album') !== -1 
                                                    ?<Link className ='songName' to={`/Song/${song.song_id}?albumId=${song.album_id}`}>{song.song}</Link>
                                                    :location.pathname.indexOf('Artist') !== -1 
                                                    ?<Link className ='songName' to={`/Song/${song.song_id}?artistId=${song.artist_id}`}>{song.song}</Link>
                                                    :null
                                                }
                                                {

                                                    song.album
                                                    ?<Link to={`/Album/${song.album_id}`}><div className= 'artistOfSong'>{song.album}</div></Link>
                                                    :<Link to={`/Artist/${song.artist_id}`}><div className= 'artistOfSong'>{song.artist}</div></Link>
                                                }
                                            </div>
                                        <div className ='songLength' >{song.length.slice(0,5)}</div>
                                </div>
                            })
                        }
                </div>
      );
}

export default Album;