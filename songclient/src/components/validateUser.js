function validateUser(value){
    if(value.length <6 || typeof value !== 'string' || value.length>12){
        return false;
    }
    let lettersCount=0,numbersCount =0;
    for(let i = 0; i < value.length; i++){
        console.log(value[i]);
        if(value[i] >= 'a' && value[i] <= 'z' || value[i] >= 'A' && value[i] <= 'Z'){
            lettersCount++;
            console.log('plusletter');
        }else if(Number(value[i]) > 0 && Number(value[i]) <10){
            numbersCount++;
        }else{
            return false;
        }
    }
    //console.log('numberCount',numbersCount,'lettersCount',numbersCount);
    if(lettersCount>=4 && numbersCount>=2){
        return true;
    }else return false;
    
}

function validatePassword(value){
    if(value.length <8 || typeof value !== 'string' || value.length>12){
        return false;
    }
    let lowerCase=0,numbers =0,upperCase=0,symbols=0;
    for(let i = 0; i < value.length; i++){
        console.log(value[i]);
        if(value[i] >= 'a' && value[i] <= 'z' ){
            lowerCase++;
            console.log('pluslower');
        }else if(value[i] >= 'A' && value[i] <= 'Z'){
            upperCase++;
            console.log('plusupper');
        }else if(Number(value[i]) > 0 && Number(value[i]) <10){
            numbers++;
        }else if(value[i]==='!' || value[i]=='@' || value[i]=='#' || value[i]=='$'
                || value[i]=='%' || value[i]=='&' || value[i]=='*' || value[i]=='?'){
            symbols++;
        }else{
            return false;
        }
    }
    if(!(symbols>0) || !(numbers>0) || !(lowerCase>0) || !(upperCase>0)){
        return false;
    }
    return true;
    
}
export {validateUser , validatePassword}
//export default validateUser;