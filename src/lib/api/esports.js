import axios from "axios";
import { apiUrlEsports } from "./apiConfig";


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