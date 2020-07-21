import axios from "axios";
import { apiUrlEsports } from "./apiConfig";
import openSocket from 'socket.io-client';


// Create an instance using the config defaults provided by the library
// At this point the timeout config value is `0` as is the default for the library
const instance = axios.create();
let SEC = 200;
// Override timeout default for the library
// Now all requests using this instance will wait 2.5 seconds before timing out
instance.defaults.timeout = SEC*1000;

/**
 *
 * @param {*} params
 * @name Get All eSports Games
 * @use To show all eSports games
 */

export async function getVideoGames(params) {
    try{
        let res = await fetch(`${apiUrlEsports}/api/get/videogames/layout`, {
            method : 'POST',
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify(params)})
        return res.json();
    }catch(err){
        throw err;
    }
}

/**
 *
 * @param {*} params
 * @name Get All eSports Matches
 * @use To show all eSports Matches
 */

export async function getAllMatches(params) {
    try{
        let res = await fetch(`${apiUrlEsports}/api/get/matches/all/layout`, {
            method : 'POST',
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify(params)})
        return res.json();
    }catch(err){
        throw err;
    }
}

/**
 *
 * @param {*} params
 * @name Get All eSports Matches by Series
 * @use To show all eSports Matches by Series
 */

export async function getAllMatchesBySeries(params) {
    try{
        let res = await fetch(`${apiUrlEsports}/api/get/matches/series/layout`, {
            method : 'POST',
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify(params)})
        return res.json();
    }catch(err){
        throw err;
    }
}

/**
 *
 * @param {*} params
 * @name Get Specific eSports Match
 * @use To show Specific eSports Match
 */

export async function getSpecificMatch(params) {
    try{
        let res = await fetch(`${apiUrlEsports}/api/get/match/specific/layout`, {
            method : 'POST',
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify(params)})
        return res.json();
    }catch(err){
        throw err;
    }
}

/**
 *
 * @param {*} params
 * @name Get eSports Team
 * @use To show eSports Team
 */

export async function getSpecificTeam(params) {
    try{
        let res = await fetch(`${apiUrlEsports}/api/get/videogame/team/layout`, {
            method : 'POST',
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify(params)})
        return res.json();
    }catch(err){
        throw err;
    }
}

/**
 *
 * @param {*} params
 * @param {*} bearerToken
 * @name Create eSports Bet
 * @use Once User wants to bet
 */

export async function createBet(params, bearerToken) {
    try{
        const { app, matchId, user } = params;
        const socket = openSocket('ws://ms-esports-dev.herokuapp.com');
        socket.on('connect', () => {
            socket.emit('authenticate', { token: bearerToken })
            .on('authenticated', () => {})
            .on('unauthorized', (msg) => {
                console.log(`unauthorized: ${JSON.stringify(msg.data)}`);
                throw new Error(msg.data.type);
            });
            socket.emit("createBet", {
                app: app, 
                resultSpace: 
                [{
                    matchId: matchId, 
                    marketType: "winnerTwoWay", 
                    betType: 0, 
                    statistic: 0.5
                }, 
                {
                    matchId: matchId, 
                    marketType: "winnerTwoWay", 
                    betType: 0, 
                    statistic: 0.5
                }], 
                user: user, 
                betAmount:0.02, 
                currency:"5e108498049eba079930ae1c"
            });
            socket.on("createBetReturn", (msg)=>{
                console.log(msg);
            });
        });

    }catch(err){
        console.log(err);
        throw err;
    } 
    /*
    try{        
        let res = await fetch(`${apiUrl}/api/app/games/bet/place`, {
            method : 'POST',
            timeout: 1000*1000,
            headers : addSecurityHeader({bearerToken, payload :  payload || params.user}),
            body : JSON.stringify(params)}
        )
        return res.json();
    }catch(err){
        console.log(err);
        throw err;
    } 
    */
}