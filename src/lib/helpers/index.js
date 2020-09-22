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
        color : colors ? colors.find(c => c.type === 'primaryColor').hex : "#0f0e1d",
        highlightColor : colors ? colors.find(c => c.type === 'backgroundColor').hex : "#17162d"
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
    var game = games[Math.floor(Math.random() * games.length)];
    var row = rows[Math.floor(Math.random() * rows.length)];
    let currency = row ? row.currency : null;
    const virtual = getApp().virtual;
    if (virtual === true) {
        currency = getApp().currencies.find(c => c.virtual === true)._id;
    }

    let fakeUserName = faker.internet.userName();
    let fakeId = faker.random.uuid().replace(/-/g, '').substring(0, 24);
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
            id: fakeId,
            game : game,
            isWon: randomValue.isWon,
            payout: randomValue.payout + 'x',
            timestamp: "a few seconds ago",
            username: fakeUserName.length > 10 ? fakeUserName.substring(0, 4)+'...'+fakeUserName.substring(fakeUserName.length-3, fakeUserName.length) : fakeUserName,
            winAmount: randomValue.winAmount,
            currency
        }

        rows.unshift(newRow);

        if(rows.length >= size) {
            rows.pop();
        }
    }

    return rows;
}

function getWebsite() {
    const arr = window.location.href.split("/");
    const url = arr[0] + "//" + arr[2];

    return url;
}

function getAddOn(){
    return  Cache.getFromCache("appInfo") ? Cache.getFromCache("appInfo").addOn : {};
}

function loadWheelOptions(game){
    const resultSpaceColors = [
        {
            "color" : '#000000'
        },
        {        
            "color" : '#406c82'
        },
        {
            "color" : '#00e403'
        },
        {
            "color" : '#d5e8f2'
        },
        {
            "color" : '#fde905'
        },
        {
            "color" : '#7f46fd'
        },
        {
            "color" : '#fca32f'
        }
    ]

    let options = [];
    let indexOptions = 0;

    for(var i = 0; i < game.resultSpace.length; i++){
        let resultSpace = game.resultSpace[i];
        let optExists = options.find( opt => opt.multiplier == resultSpace.multiplier);
        if(!optExists){
            let color = resultSpaceColors[indexOptions].color;
            // Does not exist
            options.push({
                index : indexOptions,
                probability : resultSpace.probability,
                multiplier : resultSpace.multiplier,
                amount : 1,
                start : i,
                placings : [i],
                color : color
            })
            indexOptions = indexOptions + 1;
        }else{
            optExists.placings.push(i)
            // Exit update
            options[optExists.index] = {
                ...optExists,
                amount : optExists.amount + 1,
                placings : optExists.placings,
                probability : optExists.probability + resultSpace.probability
            }
        }
    }

    return options;
}

function getIcon(index) {
    const { icons } = Cache.getFromCache("appInfo") ? Cache.getFromCache("appInfo").customization : {};

    if(icons.useDefaultIcons !== true && index < icons.ids.length) {
        return icons.ids[index].link;
    }

    return null;
}

export { 
    dateToHourAndMinute, getAppCustomization, 
    fromSmartContractTimeToMinutes, getGames, 
    isUserSet, getMinutesfromSeconds, 
    getQueryVariable,  getGeo,
    getApp,
    processResponse,
    getSkeletonColors,
    loadFakeBets,
    getWebsite,
    getAddOn,
    loadWheelOptions,
    getIcon
}