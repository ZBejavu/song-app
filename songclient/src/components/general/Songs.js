import React,{useState,useEffect} from 'react';
import axios from 'axios';
import SongContainer from '../SongContainer';
import errorImage from '../../albumCover/errorImage.png';
import {Link} from 'react-router-dom';
function Albums(props){
    const [myList, setMyList] = useState([]);
    useEffect(() => {
        try{
            axios.get('/api/songs').then(response => {
                const data = response.data;
                console.log(data);
                const sortedData = data.sort((a, b) => {
                    const name1= a.name.toUpperCase(),
                    name2= b.name.toUpperCase();
                    if(name1 > name2){
                        return 1;
                    }
                    if(name2 > name1){
                        return -1;
                    }
                    return 0;
                });
                setMyList(sortedData);
            })
        }catch(e){
            console.error(e);
        }
    },[])
    return (
        <>
            <SongContainer songArray={myList}/>
        </>
      );
}

export default Albums;