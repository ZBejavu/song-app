import React,{useState,useEffect} from 'react';
import axios from 'axios';
import network from '../../services/network';
import './landing.css';
import {Link, useHistory} from 'react-router-dom';
import { green } from '@material-ui/core/colors';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import CloseIcon from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';
import {validateUser , validatePassword} from '../validateUser';
import Carousel from '../Carousel';
import DoneIcon from '@material-ui/icons/Done';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CircularProgress from '@material-ui/core/CircularProgress';
import SongList from '../specificResults/SongList';
import createEvent from '../../services/mixpanel';
function CreateAccount(props){
    const history = useHistory();
    const [inputVal , setInputVal] = useState();
    const [checkingUser, setCheckingUser] = useState(false);
    const [password,setPassword] = useState();
    const [passwordOk, setPasswordOk] = useState(false);
    const [password2, setPassword2] = useState();
    const [email, setEmail] = useState();
    const [emailOk, setEmailOk] = useState();
    const [identical, setIdentical] = useState(false);
    const [artistList , setArtistList] = useState();
    const [preference , setPreference] = useState([]);
    //const [createSuccess , setCreateSuccess] = useState(false);
    const [userOk , setUserOk] = useState(false);
    let typingTimer;                //timer identifier
    let doneTypingInterval = 1000;  //time 

    useEffect(() => {
        network.get('/api/entry/topArtists').then(response => {
            setArtistList(response.data);
        }).catch(e => {
            console.log(e);
        })
    },[])
    async function checkUserExist(name){
        if(!validateUser(name)){
            setUserOk(false);
            return;
        }
        setCheckingUser(true);
        try{
            const {data} = await network.post(`/api/entry/nameUnique/`,{name});
            if(data === true){
                setCheckingUser(false);
                setUserOk(true);
            } else if(data === false){
                setCheckingUser(false);
                setUserOk(false);
            }else{
                console.log(data);
            }
        }catch(e){
            console.log(e);
        }
    }

    useEffect(()=>{
        if(!password2 || !password){
            return setIdentical(false);
        }
        if(password2 === password){
            setIdentical(true);
        }else{
            setIdentical(false);
        }
    },[password,password2])

    useEffect(() => {
        if(password){
            setPasswordOk(validatePassword(password));
        }else{
            setPasswordOk(false);
        }
    },[password]);

    function checkEmailExists(email){
        if(!email || email.indexOf('@') === -1 || email.indexOf('@') <3){
            return setEmailOk(false);
        }
      network.post(`/api/entry/emailUnique`,{email}).then(response => {
        const data = response.data;
        if(data === true){
            return setEmailOk(true);
        }else if(data === false){
            return setEmailOk(false);
        }else{
            console.log(data);
        }
      }).catch(e=>console.error(e)) 
    }

    function addPreference(value){
        let arr = preference.slice();
        let artistsCopy = artistList.slice();
        let artistToPick = artistsCopy.find(artist=> artist.name === value.name);
        if(artistToPick){
            artistToPick.picked = true;
            console.log(artistsCopy);
            setArtistList(artistsCopy.slice());
        }
        arr.push(value);
        setPreference(arr);
    }

    function createUser(){
        if(!passwordOk || !userOk || !emailOk || !identical || preference.length<3){
            return;
        }
        const artists = preference.map(artist => artist.id);
        const userPref = {artists};
        console.log(userPref);
        const user={
            name:inputVal,
            email: email,
            password: password,
            preferences: JSON.stringify(userPref),
        }
        network.post(`api/entry/create`,user).then(result => {
            console.log(result.data);
            if(result.data === true){
                createEvent("User Created", {"email": email})
                history.push('/login');
            }
        }).catch(e=> console.error(e))
    }

    function removePreference(value){
        let arr = preference.filter(artist => artist.id !== value.id);
        let artistsCopy = artistList.slice();
        let artistToRemove = artistsCopy.find(artist=> artist.name === value.name);
        if(artistToRemove){
            artistToRemove.picked = false;
            console.log(artistsCopy);
            setArtistList(artistsCopy.slice());
        }
        setPreference(arr);
    }

    return (
          <div className="container">
            <div className="inputContain">
                <div className='inputTitle'>Username :</div>
                <input
                onKeyUp={(e)=>{
                    let value = e.target.value;
                    typingTimer = setTimeout(() => {
                        checkUserExist(value);
                        setInputVal(value);
                    },doneTypingInterval)
                }} 
                onKeyDown={() => clearTimeout(typingTimer)}  
                className='name' type='text' />
                <div className='progress'>
                    {checkingUser?
                        <CircularProgress color='primary' size={20}/>
                        :inputVal&&userOk?
                        <div className='doneIcon'><DoneIcon color='inherit' /></div>
                        :inputVal&&!userOk?
                        <div className='errorIcon'><CloseIcon color='inherit' /></div>
                        :<div className='errorIcon'><ErrorOutlineIcon color='inherit' /></div>
                    }
                </div>
            </div>
            <div className="inputContain">
            <div className='inputTitle'>Password :</div>
                <input onChange={(e) => setPassword(e.target.value)} className='password' type='password' />
                <div className='progress'>
                    {passwordOk ?
                        <div className='doneIcon'><DoneIcon color='inherit' /></div>
                        :password&&!passwordOk?
                        <div className='errorIcon2'><WarningIcon color='inherit' /></div>
                        :<div className='errorIcon'><ErrorOutlineIcon color='inherit' /></div>
                    }
                </div>
            </div>
            <div className="inputContain">
            <div className='inputTitle'>Verify Password :</div>
                <input
                onChange={(e) => {setPassword2(e.target.value)}} 
                className='password' type='password' />
                <div className='progress'>
                    {identical ?
                        <div className='doneIcon'><DoneIcon color='inherit' /></div>
                        :password&&!identical?
                        <div className='errorIcon2'><CloseIcon color='inherit' /></div>
                        :null
                    }
                </div>
            </div>
            <div className="inputContain">
            <div className='inputTitle'>Email :</div>
                <input
                onKeyUp={(e)=>{
                    let value = e.target.value;
                    typingTimer = setTimeout(() => {
                        checkEmailExists(value)
                        setEmail(value);
                    },doneTypingInterval)
                }} 
                onKeyDown={() => clearTimeout(typingTimer)} 
                className='email' type='text' />
                <div className='progress'>
                    {emailOk ?
                        <div className='doneIcon'><DoneIcon color='inherit' /></div>
                        :email&&!emailOk?
                        <div className='errorIcon'><CloseIcon color='inherit' /></div>
                        :<div className='errorIcon'><ErrorOutlineIcon color='inherit' /></div>
                    }
                </div>
            </div>
            
            {artistList&& <div className='inputTitle'>Pick 3:</div>}
            {artistList&&
                <Carousel preference={preference} removePreference={removePreference} addPreference={addPreference} musicObj={artistList} title='none' type='createAcc' />
            }
                <div onClick={()=> createUser()} className='CreateAccount'>Create User</div>
                <div className='requirements'>
                    <div>
                        *USERNAME - unique, atleast 4 letters 2 numbers, less than 12 total 
                    </div>
                    <ul>
                    *PASSWORD -
                        <li>length between 6-12</li>
                        <li>at least -<ul>
                            <li>1 number</li>
                            <li>1 letter</li>
                            <li>1 uppercase letter</li>
                            <li>1 symbol(!@#$%&*?)</li>
                            </ul>
                        </li>
                    </ul>
                </div>
            
          </div>
      );
}

export default CreateAccount;