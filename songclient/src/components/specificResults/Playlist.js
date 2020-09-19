import React,{useState,useEffect} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import './Specific.css';
import playlistImage from '../../albumCover/playlistImage.png';
import SongContainer from '../SongContainer';
function Album(props){
    const[playlistObj , setPlaylistObj] = useState();
    useEffect(() => {
        const id = props.match.params.id;
        try{
            let getplaylist = axios.get(`/playlist/${id}`).then(result =>{
                if(!result.data.info){
                    return ;
                }
                setPlaylistObj(result.data)
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
                <img className="specImage" src = {`${playlistObj.info['cover_img']}`} onError={(e)=>{e.target.src=playlistImage}} />
                <div className="info">
                    <div>{playlistObj.info.name}</div>
                    <div className='smallerDetails'>
                        <div>Created at : {playlistObj.info.created_at.slice(0,10)}</div>
                    </div>
                </div>
            </div>

            <SongContainer songArray={playlistObj.songList} />

        </div>
      );
}

export default Album;