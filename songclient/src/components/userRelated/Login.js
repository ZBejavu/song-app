import React,{useState,useEffect} from 'react';
import axios from 'axios';
import './landing.css';
import {Link} from 'react-router-dom';
import { green } from '@material-ui/core/colors';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import CloseIcon from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';
import {validateUser , validatePassword} from '../validateUser';
import DoneIcon from '@material-ui/icons/Done';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CircularProgress from '@material-ui/core/CircularProgress';
function CreateAccount(props){
    const [inputVal , setInputVal] = useState();
    const [checkingUser, setCheckingUser] = useState(false);
    const [password,setPassword] = useState();
    const [passwordOk, setPasswordOk] = useState(false);
    const [password2, setPassword2] = useState();
    const [identical, setIdentical] = useState(false);
    const [userOk , setUserOk] = useState(false);
    let typingTimer;                //timer identifier
    let doneTypingInterval = 1000;  //time 

    async function checkUserExist(value){
        if(!validateUser(value)){
            setUserOk(false);
            return;
        }
        setCheckingUser(true);
        try{
            const {data} = await axios.get(`/userexists/${value}`);
            if(data === true){
                setCheckingUser(false);
                setUserOk(false);
            } else if(data === false){
                setCheckingUser(false);
                setUserOk(true);
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
    },[password])

    return (
          <div className="container">
            <div className="inputContain">
                <div className='inputTitle'>USERNAME:</div>
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
            <div className='inputTitle'>PASSWORD:</div>
                <input onChange={(e) => setPassword(e.target.value)} className='password' type='password' />
                <div className='progress'>
                    {passwordOk ?
                        <div className='doneIcon'><DoneIcon color='inherit' /></div>
                        :password&&!passwordOk?
                        <div className='errorIcon'><CloseIcon color='inherit' /></div>
                        :<div className='errorIcon'><ErrorOutlineIcon color='inherit' /></div>
                    }
                </div>
            </div>
            <div className="inputContain">
            <div className='inputTitle'>PASSWORD:</div>
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
                <div className='CreateAccount'>Create User</div>
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