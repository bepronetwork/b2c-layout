import moment from 'moment';
import Cache from '../cache/cache';
import _ from 'lodash';

function dateToHourAndMinute(date){
    date = new Date(date);
    let hours = date.getHours();
    let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    let ret = '';

    if((hours > 12)){
        ret = `${hours-12}:${minutes} PM`;
    }else if(hours == 0){
        ret = `${12}:${minutes} AM`;
    }
    else if(hours == 12){
        ret = `${12}:${minutes} PM`;
    }else{
        ret = `${hours}:${minutes} AM`;
    }
    return ret;
}


function fromSmartContractTimeToMinutes(time){
    return moment().startOf('day')
    .seconds(time)
    .format('H:mm.ss');
}

function getGames() {
    return  Cache.getFromCache("appInfo") ? Cache.getFromCache("appInfo").games : [];
}


function isUserSet(profile){
    if(!profile || _.isEmpty(profile)){
        return false;
    }else{
        return true;
    }
}

export { dateToHourAndMinute, fromSmartContractTimeToMinutes, getGames, isUserSet }