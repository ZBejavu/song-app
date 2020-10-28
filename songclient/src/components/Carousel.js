import React,{useState,useEffect,useContext} from 'react';
import MusicModal from './musicModal';
import {Link} from 'react-router-dom';
import errorImage from '../albumCover/errorImage.png';
import playlistImage from '../albumCover/playlistImage.png';
import picked from '../albumCover/picked.png';
import { Icon } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import PlayerContext from './PlayerContext'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import createEvent from '../services/mixpanel';
function Carousel({musicObj , type , title , addPreference, removePreference, preference }){

    const[carousel,setCarousel] = useState({from:0,to:5});
    const player = useContext(PlayerContext);
    function carouselSetter(value){
        if(value ==='forward'){
            setCarousel({from:carousel.from+5, to:carousel.to+5})
        }else if(value ==='back'){
            setCarousel({from:carousel.from-5, to:carousel.to-5})
        }
    }
    const myList = musicObj;
    console.log();
    return (
        <div className="specContainer">
            {typeof myList === 'string'? null :myList && (
            <div className='specResultContainer'>
                <div className="specTitle">{title?title==='none'?'':title:type}</div>
                <div style={type==='createAcc'? {marginLeft:'0'}:{}} className="specResults">
            {carousel.to>5 &&<ArrowBackIosIcon className='slideButton' onClick={() => carouselSetter('back')} />} {/*<div onClick={() => carouselSetter('back')} >{'<'}</div>*/}     
                    {
                        (type==='artist' || type==='topAlbums')&&(
                        myList.slice(carousel.from,carousel.to).map(album => {
                            return <div className ='speclistContainer'>
                            <div className ='specificImageDiv' ><img onError={(e)=> e.target.src=errorImage} src={album.coverImg} alt={`${album.name}Cover`} className ='specificImage' /></div>
                            <Link to={`/Album/${album.id}`}><div className ='specificName' onClick={() => createEvent("Album Click", {"name": album.name})}>{album.name}</div></Link>
                            {/* <Link to={`/Album/${album.album_id}`}><div className ='specificName' onClick={() => console.log(album)}>{album["album"]}</div></Link> */}
                            </div>
                        }))
                    }

                    {
                        (type==='topArtists')&&(
                        myList.slice(carousel.from,carousel.to).map(artist => {
                            return <div className ='speclistContainer'>
                            <div className ='specificImageDiv' ><img onError={(e)=> e.target.src=errorImage} src={artist.coverImg} alt={`${artist.name}Cover`} className ='specificImage' /></div>
                            <Link to={`/Artist/${artist.id}`}><div className ='specificName' onClick={() => createEvent("Artist Click", {"name": artist.name})}>{artist.name}</div></Link>
                            </div>
                        }))
                    }
                    {
                        (type ==='createAcc')&&(
                        myList.slice(carousel.from,carousel.to).map(artist => {
                            return <div onClick={()=>(preference.length<3 && !artist.picked)? addPreference(artist):artist.picked?removePreference(artist):null} style={{cursor:'pointer'}} className ='speclistContainer'>
                            <div className ='specificImageDiv' ><img onError={(e)=> e.target.src=errorImage} src={artist.picked?picked :artist.coverImg} alt={`${artist.name}Cover`} className ='specificImage' /></div>
                            <div className ='nameForCreate' onClick={() => console.log(artist)}>{artist.name}</div>
                            </div>
                        }))
                    }

                    {
                        (type==='topSongs')&&(
                        myList.slice(carousel.from,carousel.to).map(song => {
                            return <div className ='speclistContainer'>
                            <div className ='specificImageDiv' ><img onError={(e)=> e.target.src=errorImage} src={song.Artist.coverImg} alt={`${song.name}Cover`} className ='specificImage' /></div>
                            <div className ='specificName' onClick={() => {player.setDefinitions({from:type,songId:song.id}); player.setPlay(true); }}>{song.name}</div>
                            {/* <Link to={`/Song/${song.id}?topSongs=123`}><div className ='specificName' onClick={() => console.log(song)}>{song.name}</div></Link> */}
                            </div>
                        }))
                    }

                    {
                        (type==='topPlaylists')&&(
                        myList.slice(carousel.from,carousel.to).map(playlist => {
                            return <div className ='speclistContainer'>
                            <div className ='specificImageDiv' ><img onError={(e)=> e.target.src=playlistImage} src={playlist.coverImg} alt={`${playlist.name}Cover`} className ='specificImage' /></div>
                            <Link to={`/Playlist/${playlist.id}`}><div className ='specificName' onClick={() => console.log(playlist)}>{playlist.name}</div></Link>
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
