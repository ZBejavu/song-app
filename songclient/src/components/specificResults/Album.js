import React,{useState,useEffect} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import './Specific.css';
import SongContainer from '../SongContainer';
function Album(props){
    const[albumObj , setAlbumObj] = useState();
    const[link, setLink] = useState();
    useEffect(() => {
        const id = props.match.params.id;
        try{
            let getalbum,getAlbums;
            getalbum = axios.get(`/album/${id}`);
            getAlbums = axios.get(`/songs?albumId=${id}`);
            Promise.all([getalbum,getAlbums]).then(values => {
                setAlbumObj({
                    info: values[0].data[0],
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
                <img className="specImage" src = {`${albumObj.info['album_img']}`} onError={(e)=>{e.target.style.display='none'}} />
                <div className="info">
                    <div>{albumObj.info.album}</div>
                    <div className='smallerDetails'>
                        <div>Released at : {albumObj.info.album_uploaded.slice(0,10)}</div>
                        <Link to={`/Artist/${albumObj.info.artist_id}`}><div>By: {albumObj.info.artist}</div></Link>
                    </div>
                </div>
            </div>

            <SongContainer songArray={albumObj.songs} />

        </div>
      );
}

export default Album;