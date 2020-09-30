import React,{useState,useEffect,useContext} from 'react';
import axios from 'axios';
import network from '../../services/network';
import '../Top.css';
import './Specific.css';
import Carousel from '../Carousel';
import SongContainer from '../SongContainer';
import errorImage from '../../albumCover/errorImage.png';
import PlayerContext from '../PlayerContext'
import {Link,useHistory, useLocation, useParams, useRouteMatch} from 'react-router-dom';
function Artist(props){
    const[artistObj , setArtistObj] = useState();
    const[carousel,setCarousel] = useState({from:0,to:5});
    const match = useRouteMatch();
    useEffect(() => {
        const id = match.params.id;
        try{
            let getArtist,getAlbums,getSongs;
            getArtist = network.get(`/api/artists/${id}`);
            getAlbums = network.get(`/api/artists/${id}/albums`);
            getSongs = network.get(`/api/songs/songsFromArtist/${id}`);
            Promise.all([getArtist,getAlbums,getSongs]).then(values => {
                if(values.some(response => response.status === 401)){
                    return props.setAuthorized(false);
                }
                setArtistObj({
                    info: values[0].data,
                    albums: values[1].data,
                    songs: values[2].data
                });
            }).catch(e => {console.log(e)})
        }catch(e){
            console.log(e);
        }
    },[])
    artistObj && console.log(artistObj);

    function carouselSetter(value){
        if(value ==='forward'){
            setCarousel({from:carousel.from+5, to:carousel.to+5})
        }else if(value ==='back'){
            setCarousel({from:carousel.from-5, to:carousel.to-5})
        }
    }
    console.log(carousel);

    return (
        !artistObj ? null 
        :<div className="specificArtist">
            <div className='specificHeader'>
                <img className="specImage" src = {`${artistObj.info.coverImg}`} onError={(e)=>{e.target.style.display='none'}} />
                <div className="info">
                    <div>{artistObj.info.name}</div>
                    <div className='smallerDetails'>Active since : {artistObj.info.uploadedAt.slice(0,10)}</div>
                </div>
            </div>
            <div className='specTitle'>Songs</div>
            <SongContainer songArray={artistObj.songs} />
            <Carousel musicObj={artistObj.albums} type='artist' title='Albums'/>
{/* 
            <div className="specContainer">
                <div className='specResultContainer'>
                    <div className="specTitle">Albums</div>
                    <div className="specResults">
                        {carousel.to>5 &&<div onClick={() => carouselSetter('back')} >{'<'}</div>}     
                        {
                            artistObj.albums.slice(carousel.from,carousel.to).map(album => {
                                return <div className ='speclistContainer'>
                                <div className ='specificImageDiv' ><img onError={(e)=> e.target.src=errorImage} src={album.album_img} alt={`${album.album}Cover`} className ='specificImage' /></div>
                                <Link to={`/Album/${album.album_id}`}><div className ='specificName' onClick={() => console.log(album)}>{album["album"]}</div></Link>
                                </div>
                            })
                        }
                        {carousel.to< artistObj.albums.length &&<div onClick={() => carouselSetter('forward')}>{'>'}</div>}   
                    </div>
                </div>
            </div> */}
        </div>
      );
}

export default Artist;