import React,{useState,useEffect} from 'react';
import axios from 'axios';
import errorImage from '../../albumCover/errorImage.png';
import {Link} from 'react-router-dom';
function Artists(props){
    const [myList, setMyList] = useState([[]]);
    useEffect(() => {
        try{
            axios.get('/api/artists').then(response => {
                const data = response.data;
                console.log(data);
                const devidedArr = [], sortedData = data.sort((a, b) => {
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
                for(let i = 0; i<sortedData.length; i+=5){
                    devidedArr.push(sortedData.slice(i,i+5));
                }
                setMyList(devidedArr);
            })
        }catch(e){
            console.error(e);
        }
    },[])
    return (
        <>
        {

            myList.map(row => {
                return (<div style={{marginLeft:'5%', width:'95%'}} className="specResults">
                {
                    row.map(artist => {
                    return <div style={{marginTop:'5%'}} className ='speclistContainer'>
                    <div className ='specificImageDiv' ><img onError={(e)=> e.target.src=errorImage} src={artist.coverImg} alt={`${artist.name}Cover`} className ='specificImage' /></div>
                    <Link to={`/Artist/${artist.id}`}><div className ='specificName' onClick={() => console.log(artist)}>{artist.name}</div></Link>
                    </div>
                    })
                }
                </div>);
            })
        }
        </>
      );
}

export default Artists;