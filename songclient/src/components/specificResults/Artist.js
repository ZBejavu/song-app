import React,{useState,useEffect} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import '../Top.css';
import './Specific.css';
import errorImage from '../../albumCover/errorImage.png';
function Artist(props){
    const[artistObj , setArtistObj] = useState();
    useEffect(() => {
        const id = props.match.params.id;
        try{
            let getArtist,getAlbums;
            getArtist = axios.get(`/artist/${id}`);
            getAlbums = axios.get(`/albums?artistId=${id}`);
            Promise.all([getArtist,getAlbums]).then(values => {
                setArtistObj({
                    info: values[0].data[0],
                    albums: values[1].data 
                });
            }).catch(e => {console.log(e)})
        }catch(e){
            console.log(e);
        }
    },[])
    artistObj && console.log(artistObj);

    return (
        !artistObj ? null 
        :<div className="specificArtist">
            <div className='specificHeader'>
                <img className="specImage" src = {`${artistObj.info['artist_img']}`} onError={(e)=>{e.target.style.display='none'}} />
                <div className="info">
                    <div>{artistObj.info.artist}</div>
                    <div className='smallerDetails'>Active since : {artistObj.info.artist_uploaded.slice(0,10)}</div>
                </div>
            </div>

            <div className="specContainer">
                <div className='specResultContainer'>
                    <div className="specTitle">Albums</div>
                    <div className="specResults">     
                        {
                            artistObj.albums.map(album => {
                                return <div className ='speclistContainer'>
                                <div className ='specificImageDiv' ><img onError={(e)=> e.target.src=errorImage} src={album.album_img} alt={`${album.album}Cover`} className ='specificImage' /></div>
                                <Link to={`/Album/${album.album_id}`}><div className ='specificName' onClick={() => console.log(album)}>{album["album"]}</div></Link>
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
      );
}

export default Artist;