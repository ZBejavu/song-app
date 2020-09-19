import React,{useState,useEffect} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import './Specific.css';
import MusicModal from '../musicModal';
import errorImage from '../../albumCover/errorImage.png';
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

                <div className="songContainer2">    
                        {
                            albumObj.songs.map((song,index) => {
                                return <div className ='listContainer2'>
                                    {/* <div onClick={()=>{proper.func(song.youtube_link.slice(17,song.youtube_link.length))}}>Play</div> */}
                                    <div className='index'>{index+1}.</div>
                                            <div className="nameAndArtist">
                                                <Link className ='songName' to={`/Song/${song.song_id}?albumId=${song.album_id}`}>{song.song}</Link>
                                                <Link to={`/Artist/${song.artist_id}`}><div className= 'artistOfSong'>{song.artist}</div></Link>
                                            </div>
                                        <div className ='songLength' >{song.length.slice(0,5)}</div>
                                </div>
                            })
                        }
                </div>
                
            <MusicModal url={link}/>
        </div>
      );
}

export default Album;