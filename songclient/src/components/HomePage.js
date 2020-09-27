import React,{useState,useEffect , useContext} from 'react';
import axios from 'axios';
import './Top.css';
import Carousel from './Carousel';
function HomePage(){
    const [topObject, setTopObject] = useState();
    useEffect( () => {
        let settingObj = {
            topArtists:[],
            topAlbums:[],
            topSongs:[],
            topPlaylists:[],
        }
        
        try{
            let promise1,promise2,promise3,promise4;
            promise1 =axios.get('/api/artists/topArtists')
            promise2 =axios.get('/api/albums/topAlbums')
            promise3 =axios.get('/api/songs/topSongs')
            promise4 =axios.get('/api/playlists/topPlaylists')
            Promise.all([promise1,promise2,promise3,promise4]).then((values) =>{
                settingObj.topArtists = values[0].data;
                settingObj.topAlbums = values[1].data;
                settingObj.topSongs = values[2].data;
                settingObj.topPlaylists = values[3].data;
                setTopObject(settingObj);
            }).catch(e => console.log(e));
        }catch(e){
            console.log(e);
        }
    },[])

    return (
        <div>
            {
                !topObject?null:
                <div className='carouselContainer'>
                    <Carousel musicObj={topObject.topAlbums} type='topAlbums' title='Top Albums' />
                    <Carousel musicObj={topObject.topArtists} type='topArtists' title='Top Artists'/>
                    <Carousel musicObj={topObject.topSongs} type='topSongs' title='Top Songs' />
                    <Carousel musicObj={topObject.topPlaylists} type='topPlaylists' title='Top Playlists' />
                </div>
            }
        </div>
      );
}

export default HomePage;