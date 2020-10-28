import mixpanel from 'mixpanel-browser';
mixpanel.init("efe28916ac3046f70e22cd4230da815d");
export default function createEvent(eventName, moreInfo){
    if(moreInfo){
        mixpanel.track(eventName, moreInfo);
    }else{
        mixpanel.track(eventName);
    }
    
}