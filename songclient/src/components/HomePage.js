import React,{useState,useEffect} from 'react';
import axios from 'axios';
import logo from '../albumCover/logoImage.png';
import {Link} from 'react-router-dom';
import './Top.css';
import errorImage from '../albumCover/errorImage.png';
import MusicModal from './musicModal';
function HomePage(){
    const [topObject, setTopObject] = useState();
    const [link , setLink] = useState();
    useEffect( () => {
        let settingObj = {
            topArtists:[],
            topAlbums:[],
            topSongs:[],
            topPlaylists:[]
        }
        try{
            let promise1,promise2,promise3,promise4;
            promise1 =axios.get('/top_artists')
            promise2 =axios.get('/top_albums')
            promise3 =axios.get('/top_songs')
            promise4 =axios.get('/top_playlists')
            Promise.all([promise1,promise2,promise3,promise4]).then((values) =>{
                settingObj.topArtists = values[0].data.slice();
                settingObj.topAlbums = values[1].data.slice();
                settingObj.topSongs = values[2].data.slice();
                settingObj.topPlaylists = values[3].data.slice();
                setTopObject(settingObj);
            })
        }catch(e){
            console.log(e);
        }
    },[])

    return (
          <div class="homePage">
              <div className='header'>Home Page</div>
              {
                  !topObject ? null 
                  :<div className='topContainer'>

                      <div className='topResultContainer'>
                          <div className="topTitle">Top artists</div>
                          <div className="topResults">     
                            {
                                topObject.topArtists.map(artist => {
                                    return <div className ='listContainer'>
                                    <Link to={`/Artist/${artist.artist_id}`}><div className ='itemName'>{artist["artist"]}</div></Link>
                                    <div className ='itemImageDiv' ><img onError={(e)=> e.target.src=errorImage} src={artist.artist_img} alt={`${artist.artist}Cover`} className ='itemImage' /></div>
                                    </div>
                                })
                            }
                          </div>
                      </div>

                      <div className='topResultContainer'>
                          <div className="topTitle">Top albums</div>
                          <div className="topResults">     
                            {
                                topObject.topAlbums.map(album => {
                                    return <div className ='listContainer'>
                                    <div className='nameAndArtist'>
                                        <Link to={`/Album/${album.album_id}`}><div className ='itemName' onClick={() => console.log(album)}>{album["album"]}</div></Link>
                                        <Link to={`/Artist/${album.artist_id}`}><div className= 'artistOfSong'>{album.artist}</div></Link>
                                    </div>
                                    <div className ='itemImageDiv' ><img onError={(e)=> e.target.src=errorImage} src={album.album_img} alt={`${album.album}Cover`} className ='itemImage' /></div>
                                    </div>
                                })
                            }
                          </div>
                      </div>

                      <div className='topResultContainer'>
                          <div className="topTitle">Top songs</div>
                          <div className="topResults">     
                            {
                                topObject.topSongs.map(song => {
                                    return <div className ='listContainer'>
                                    <div className='nameAndArtist'>
                                        <div className ='itemName' onClick={() => setLink(song.youtube_link.slice(17,song.youtube_link.length))}>{song["song"]}</div>
                                        <Link to={`/Artist/${song.artist_id}`}><div className= 'artistOfSong'>{song.artist}</div></Link>
                                    </div>
                                    <div className='songLength'>{song.length.slice(0,5)}</div>
                                    {/* <div className ='itemImageDiv'>
                                        <img onError={(e)=> e.target.src=errorImage} src={song.artist_img} alt='' className ='itemImage' />
                                    </div> */}
                                    </div>
                                })
                            }
                          </div>
                      </div>

                      <div className='topResultContainer'>
                          <div className="topTitle">Top playlists</div>
                          <div className="topResults">     
                            {
                                topObject.topPlaylists.map(playlist => {
                                    return <div className ='listContainer'>
                                    <div className ='itemName' onClick={() => console.log(playlist)}>{playlist["name"]}</div>
                                    <div className ='itemImageDiv' >
                                            <img className ='itemImage' onError={(e)=> e.target.src=errorImage} src={playlist.cover_img} alt={`${playlist.name}Cover`} />
                                    </div>
                                    </div>
                                })
                            }
                          </div>
                      </div>
                      {link&&<MusicModal url={link} />}
                      
                  </div>
              }
          </div>
      );
}

export default HomePage;