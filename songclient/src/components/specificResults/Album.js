import React,{useState,useEffect,useContext} from 'react';
import axios from 'axios';
import {Link,useHistory, useLocation, useParams, useRouteMatch} from 'react-router-dom';
import PlayerContext from '../PlayerContext'
import './Specific.css';
import SongContainer from '../SongContainer';
function Album(){
    const[albumObj , setAlbumObj] = useState();
    const[link, setLink] = useState();
    const match = useRouteMatch();
    const player = useContext(PlayerContext);
    useEffect(() => {
        const id = match.params.id;
        try{
            let getSongs,getAlbum;
            getAlbum = axios.get(`/api/albums/${id}`);
            getSongs = axios.get(`/api/songs/songsFromAlbum/${id}`);
            Promise.all([getAlbum,getSongs]).then(values => {
                setAlbumObj({
                    info: values[0].data,
                    songs: values[1].data 
                });
            }).catch(e => {console.log(e)})
        }catch(e){
            console.log(e);
        }
    },[])
    albumObj && console.log(albumObj);
    console.log('link', link);
    return (
        !albumObj ? null 
        :<div className="specificArtist">
            <div className='specificHeader'>
                <img className="specImage" src = {`${albumObj.info.coverImg}`} onError={(e)=>{e.target.style.display='none'}} />
                <div className="info">
                    <div>{albumObj.info.name}</div>
                    <div className='smallerDetails'>
                        <div>Released at : {albumObj.info.uploadedAt.slice(0,10)}</div>
                        <Link to={`/Artist/${albumObj.info.artistId}`}><div>By: {albumObj.info.artistName}</div></Link>
                    </div>
                </div>
            </div>

            <SongContainer songArray={albumObj.songs} />

        </div>
      );
}

export default Album;