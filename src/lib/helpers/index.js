import Cache from '../cache/cache';
import _ from 'lodash';
import moment from 'moment-timezone';
import store from '../../containers/App/store';
import { setMessageNotification } from '../../redux/actions/message';
import faker from 'faker';
import { formatCurrency } from "../../utils/numberFormatation";

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

function loadFakeBets(rows, games, size) {
    /* fake random value */
    let ticker = row ? row.ticker : 'ETH';
    const virtual = getApp().virtual;
    if (virtual === true) {
        let currencies = getApp().currencies;
        ticker = currencies.find(c => c.virtual === true).ticker;
    }
    var game = games[Math.floor(Math.random() * games.length)];
    var row = rows[Math.floor(Math.random() * rows.length)];
    let fakeUserName = faker.internet.userName();
    let randomArray = [];
    let lostValue = {isWon : false, payout : '0.000000', winAmount : '0.000000'};
    var i = 0; do { i++; randomArray.push(lostValue) } while (i < 4);
    var i = 0; do { 
        i++; 
        let payout = Math.random() * (2.000000 - 0.050000) + 0.050000;
        let winAmount = Math.random() * (2.000000 - 0.050000) + 0.050000;
        payout = virtual === true ? payout * 10 : payout;
        winAmount = virtual === true ? winAmount * 10 : winAmount;
        const winValue =  { isWon : true, payout : formatCurrency(payout), winAmount : formatCurrency(winAmount)};
        randomArray.push(winValue) 
    } while (i < 6);
    var randomValue = randomArray[Math.floor(Math.random() * randomArray.length)];

    if(game) {
        const newRow = {
            game : game,
            isWon: randomValue.isWon,
            payout: randomValue.payout + 'x',
            timestamp: "a few seconds ago",
            username: fakeUserName.length > 10 ? fakeUserName.substring(0, 4)+'...'+fakeUserName.substring(fakeUserName.length-3, fakeUserName.length) : fakeUserName,
            winAmount: randomValue.winAmount + ' ' + ticker,
            ticker
        }

        rows.unshift(newRow);

        if(rows.length >= size) {
            rows.pop();
        }
    }

    return rows;
}


  

export { 
    dateToHourAndMinute, getAppCustomization, 
    fromSmartContractTimeToMinutes, getGames, 
    isUserSet, getMinutesfromSeconds, 
    getQueryVariable,  getGeo,
    getApp,
    processResponse,
    getSkeletonColors,
    loadFakeBets
}