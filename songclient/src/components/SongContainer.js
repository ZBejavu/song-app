import React,{useState,useEffect,useContext} from 'react';
import axios from 'axios';
import {Link, useLocation} from 'react-router-dom';
import './specificResults/Specific.css';
import PlayerContext from './PlayerContext'
function Album(props){
    const[songArray , setSongArray] = useState();
    const location = useLocation();
    const player = useContext(PlayerContext);
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
                                    <div className='index'>{index+1}.</div>
                                            <div className="nameAndArtist">
                                                {
                                                    location.pathname.indexOf('Playlist') !== -1 
                                                    ?<Link className ='songName' to={`/Song/${song.id}?playlistId=${song.Playlist[0].playlistId}`}>{song.name}</Link>
                                                     //<div className ='songName' onClick={()=>{player.setDefinitions({from:'Playlist', songId:song.id, id:song.Playlist.id}); player.setPlay(true)}} >{song.name}</div>
                                                    :location.pathname.indexOf('Album') !== -1 
                                                    ?<Link className ='songName' to={`/Song/${song.id}?albumId=${song.albumId}`}>{song.name}</Link>
                                                    //<div className ='songName' onClick={()=>{player.setDefinitions({from:'Album', songId:song.id, id:song.albumId}); player.setPlay(true)}}  >{song.name}</div>
                                                    :location.pathname.indexOf('Artist') !== -1 
                                                    ?<Link className ='songName' to={`/Song/${song.id}?artistId=${song.artistId}`}>{song.name}</Link>
                                                    //<div className ='songName' onClick={()=>{player.setDefinitions({from:'Artist', songId:song.id, id:song.artistId}); player.setPlay(true)}}  >{song.name}</div>
                                                    :null
                                                }
                                                {

                                                    song.Album && song.Artist
                                                    ?<><Link to={`/Album/${song.albumId}`}><div className= 'artistOfSong'>{song.Album.name}</div></Link><Link to={`/Artist/${song.artistId}`}><div className= 'artistOfSong'>{song.Artist.name}</div></Link></>
                                                    :null
                                                    // <Link to={`/Artist/${song.artist_id}`}><div className= 'artistOfSong'>{song.artist}</div></Link>
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