import React,{useState,useEffect,useContext} from 'react';
import axios from 'axios';
import {Link ,useHistory, useLocation, useParams, useRouteMatch} from 'react-router-dom';
import './Specific.css';
import playlistImage from '../../albumCover/playlistImage.png';
import PlayerContext from '../PlayerContext'
import SongContainer from '../SongContainer';
function Album(props){
    const[playlistObj , setPlaylistObj] = useState();
    const match = useRouteMatch();
    const player = useContext(PlayerContext);
    useEffect(() => {
        const id = match.params.id;
        try{
            let getPlaylist = axios.get(`/api/playlists/${id}`);
            let getSongsInPlaylist = axios.get(`/api/playlists/${id}/songs`);
            Promise.all([getPlaylist, getSongsInPlaylist]).then(values => {
                let playlistToSet ={
                    info: values[0].data,
                    songList: values[1].data
                }
                setPlaylistObj(playlistToSet);
            }).catch(e => {
                console.error(e);
            })
        }catch(e){
            console.log(e);
        }
    },[])
    playlistObj && console.log(playlistObj);
    return (
        !playlistObj ? null 
        :<div className="specificArtist">
            <div className='specificHeader'>
                <img className="specImage" src = {`${playlistObj.info.coverImg}`} onError={(e)=>{e.target.src=playlistImage}} />
                <div className="info">
                    <div>{playlistObj.info.name}</div>
                    <div className='smallerDetails'>
                        <div>Created at : {playlistObj.info.createdAt.slice(0,10)}</div>
                    </div>
                </div>
            </div>

            <SongContainer songArray={playlistObj.songList} />

        </div>
      );
}

export default Album;