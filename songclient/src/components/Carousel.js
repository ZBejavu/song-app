import React,{useState,useEffect} from 'react';
import MusicModal from './musicModal';
import {Link} from 'react-router-dom';
import errorImage from '../albumCover/errorImage.png';
import playlistImage from '../albumCover/playlistImage.png';
import picked from '../albumCover/picked.png';
import { Icon } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
function Carousel({musicObj , type , title , addPreference, removePreference, preference}){

    const[carousel,setCarousel] = useState({from:0,to:5});
    function carouselSetter(value){
        if(value ==='forward'){
            setCarousel({from:carousel.from+5, to:carousel.to+5})
        }else if(value ==='back'){
            setCarousel({from:carousel.from-5, to:carousel.to-5})
        }
    }
    useEffect(() => {
        console.log(musicObj)
    },[musicObj])
    console.log(carousel);
    const myList = type==='artist' ? musicObj.albums : musicObj;
    return (
        <div className="specContainer">
            {musicObj &&(
            <div className='specResultContainer'>
                <div className="specTitle">{title?title==='none'?'':title:type}</div>
                <div style={type==='createAcc'? {marginLeft:'0'}:{}} className="specResults">
            {carousel.to>5 &&<ArrowBackIosIcon className='slideButton' onClick={() => carouselSetter('back')} />} {/*<div onClick={() => carouselSetter('back')} >{'<'}</div>*/}     
                    {
                        (type==='artist' || type==='topAlbums')&&(
                        myList.slice(carousel.from,carousel.to).map(album => {
                            return <div className ='speclistContainer'>
                            <div className ='specificImageDiv' ><img onError={(e)=> e.target.src=errorImage} src={album.album_img} alt={`${album.album}Cover`} className ='specificImage' /></div>
                            <Link to={`/Album/${album.album_id}`}><div className ='specificName' onClick={() => console.log(album)}>{album["album"]}</div></Link>
                            </div>
                        }))
                    }

                    {
                        (type==='topArtists')&&(
                        myList.slice(carousel.from,carousel.to).map(artist => {
                            return <div className ='speclistContainer'>
                            <div className ='specificImageDiv' ><img onError={(e)=> e.target.src=errorImage} src={artist.artist_img} alt={`${artist.artist}Cover`} className ='specificImage' /></div>
                            <Link to={`/Artist/${artist.artist_id}`}><div className ='specificName' onClick={() => console.log(artist)}>{artist["artist"]}</div></Link>
                            </div>
                        }))
                    }
                    {
                        (type ==='createAcc')&&(
                        myList.slice(carousel.from,carousel.to).map(artist => {
                            return <div onClick={()=>(preference.length<3 && !artist.picked)? addPreference(artist):artist.picked?removePreference(artist):null} style={{cursor:'pointer'}} className ='speclistContainer'>
                            <div className ='specificImageDiv' ><img onError={(e)=> e.target.src=errorImage} src={artist.picked?picked :artist.artist_img} alt={`${artist.artist}Cover`} className ='specificImage' /></div>
                            <div className ='nameForCreate' onClick={() => console.log(artist)}>{artist["artist"]}</div>
                            </div>
                        }))
                    }

                    {
                        (type==='topSongs')&&(
                        myList.slice(carousel.from,carousel.to).map(song => {
                            return <div className ='speclistContainer'>
                            <div className ='specificImageDiv' ><img onError={(e)=> e.target.src=errorImage} src={song.artist_img} alt={`${song.song}Cover`} className ='specificImage' /></div>
                            <Link to={`/Song/${song.song_id}?topSongs=123`}><div className ='specificName' onClick={() => console.log(song)}>{song["song"]}</div></Link>
                            </div>
                        }))
                    }

                    {
                        (type==='topPlaylists')&&(
                        myList.slice(carousel.from,carousel.to).map(playlist => {
                            return <div className ='speclistContainer'>
                            <div className ='specificImageDiv' ><img onError={(e)=> e.target.src=playlistImage} src={playlist.cover_img} alt={`${playlist.name}Cover`} className ='specificImage' /></div>
                            <Link to={`/Playlist/${playlist.playlist_id}`}><div className ='specificName' onClick={() => console.log(playlist)}>{playlist["name"]}</div></Link>
                            </div>
                        }))
                    }
                    
                    {carousel.to< myList.length &&<ArrowForwardIosIcon className='slideButton' onClick={() => carouselSetter('forward')} />}   
                </div>
            </div>)}
        </div>
      );
}

export default Carousel;
