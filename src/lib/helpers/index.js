import Cache from '../cache/cache';
import _ from 'lodash';
import moment from 'moment-timezone';
import store from '../../containers/App/store';
import { setMessageNotification } from '../../redux/actions/message';

//import 'moment/locale/pt-br';

function dateToHourAndMinute(date){
    return moment(new Date(date)).fromNow();
}


function fromSmartContractTimeToMinutes(time){
    return moment().startOf('day')
    .seconds(time)
    .format('mm.ss');
}

function getGames() {
    return Cache.getFromCache("appInfo") ? Cache.getFromCache("appInfo").games : [];
}


function isUserSet(profile){
    if(!profile || _.isEmpty(profile)){
        return false;
    }else{
        return true;
    }
}

function getMinutesfromSeconds(seconds){
    return Math.floor(seconds / 60);
}

function getQueryVariable(variable)
{
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
         }
         return(false);
}


function getAppCustomization(){
    return  Cache.getFromCache("appInfo") ? Cache.getFromCache("appInfo").customization : {};
}

function getSkeletonColors(){
    const { colors } = Cache.getFromCache("appInfo") ? Cache.getFromCache("appInfo").customization : {};
    const skeletonColors = {
        color : colors ? colors.primaryColor : "#05040c",
        highlightColor : colors ? colors.backgroundColor : "#17162d"
    }

    return skeletonColors;
}

function getApp(){
    return  Cache.getFromCache("appInfo") ? Cache.getFromCache("appInfo") : {};
}

async function getGeo(){
    return new Promise( (resolve, reject) => {
        if (!navigator.geolocation){
            console.log("Geolocation is not supported by your browser");
            return;
        }
        alert("c")

        function error() {
            alert("hh")
            console.log("Unable to retrieve your location");
        }
    
        navigator.geolocation.getCurrentPosition( (position)  => {
            var latitude  = position.coords.latitude;
            var longitude = position.coords.longitude;
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?
                latlng=${latitude},${longitude}&key=${'AIzaSyBPbFrvt8RmLg6TqXtk_9E1YRs1YK4iBvM'}`)
            .then( res => res.json())
            .then(response => {
                alert("a")
                resolve(response);
                console.log("User's Location Info: ", response)
            })
            .catch(status => {
                reject(status)
                console.log('Request failed.  Returned status of', status)
            })
        }, error);
    })
}

async function processResponse(response){
    try{
        if(parseInt(response.data.status) != 200){
            let { message } = response.data;
            if(!message){message = 'Technical Issues'}
            throw new Error(message)
        }
        return response.data.message
    }catch(err){
        await store.dispatch(setMessageNotification(new String(err.message).toString()));
        throw err;
    }
}


  

export { 
    dateToHourAndMinute, getAppCustomization, 
    fromSmartContractTimeToMinutes, getGames, 
    isUserSet, getMinutesfromSeconds, 
    getQueryVariable,  getGeo,
    getApp,
    processResponse,
    getSkeletonColors
}