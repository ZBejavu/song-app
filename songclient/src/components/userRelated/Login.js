        
        import React,{useState,useEffect} from 'react';
        import DoneIcon from '@material-ui/icons/Done';
        import CloseIcon from '@material-ui/icons/Close';
        import CircularProgress from '@material-ui/core/CircularProgress';
        import WarningIcon from '@material-ui/icons/Warning';
        import {Link, useHistory} from 'react-router-dom';
        import axios from 'axios';
        import network from '../../services/network';
        import createEvent from '../../services/mixpanel';


        function Login({setAuthorized, authorized}){
        const [username, setUsername] = useState();
        const [password, setPassword] = useState();
        const [userOk, setUserOk] = useState(false);
        const [doneChecking, setDoneChecking] = useState(false);
        const [checkingUser, setCheckingUser]= useState(false);
        const history = useHistory();
        useEffect(()=> {
            if(authorized){
                history.push('/')
            }
        },[authorized])
        useEffect(()=> {
            history.replace();
        },[])
        function login(){
            setCheckingUser(true);
            if(!password || !username){
                setCheckingUser(false);
                return;
            }
            network.post('/api/entry/login',{password:password,name:username}).then(response => {
                console.log(response.data);
                if(response.data.connection){
                    setCheckingUser(false);
                    setUserOk(true);
                    setDoneChecking(true);
                    localStorage.setItem('token',response.data.token);
                    localStorage.setItem('name', response.data.name);
                    setAuthorized(true);
                    createEvent("User Logged In");
                    history.push('/');
                }else{
                    setUserOk(false);
                    setCheckingUser(false);
                    return setDoneChecking(true);
                }
            }).catch(e=>{
                console.log(e);
                setCheckingUser(false);
                setDoneChecking(true);
            })
        }



            return (
            <div className="container" style={{height:'50%'}}>
                <div className="inputContain">
                    <div className='inputTitle'>Username :</div>
                    <input onChange={(e)=>setUsername(e.target.value)} className='name' type='text' />
                    <div className='progress'>
                        {checkingUser?
                            <CircularProgress color='primary' size={20}/>
                            :username&&userOk?
                            <div className='doneIcon'><DoneIcon color='inherit' /></div>
                            :username&&!doneChecking?null
                            :username&& doneChecking?<div className='errorIcon'><CloseIcon color='inherit' /></div>
                            :<div className='errorIcon2'><WarningIcon color='inherit' /></div>
                        }
                    </div>
                </div>
                <div className="inputContain">
                    <div className='inputTitle'>Password :</div>
                    <input onChange={(e) => setPassword(e.target.value)} className='password' type='password' />
                    <div className='progress'>
                        {   checkingUser?<CircularProgress color='primary' size={20}/>
                            :userOk ?
                            <div className='doneIcon'><DoneIcon color='inherit' /></div>
                            :password&&!userOk&&!doneChecking? null
                            :doneChecking?<div className='errorIcon'><CloseIcon color='inherit' /></div>
                            :<div className='errorIcon2'><WarningIcon color='inherit' /></div>
                        }
                    </div>
                </div>
                <div onClick={()=> login()} className='CreateAccount'>Login</div>
            </div>
              );
        }
        
        export default Login;
        
        