import { appId } from "../../lib/api/apiConfig";
import { processResponse } from "../../lib/helpers";
import {
    getVideoGames,
    getAllMatches,
    getAllMatchesBySeries,
    getSpecificMatch,
    getSpecificTeam
  } from "lib/api/esports";
import _ from 'lodash';

export async function getGames() {
    try {
        let res = await getVideoGames({
            app: appId
        });

        return await processResponse(res);
    
    } catch(err){
        console.log(err)
        throw err;
    }
}

export async function getMatches() {
    try {
        let res = await getAllMatches({      
            app: appId
        });

        return await processResponse(res);
    
    } catch(err){
        console.log(err)
        throw err;
    }
}

export async function getMatchesBySeries(series) {
    try {
        let res = await getAllMatchesBySeries({      
            app: appId,
            serie_id: series
        });

        return await processResponse(res);
    
    } catch(err){
        console.log(err)
        throw err;
    }
}

export async function getMatch(matchId) {
    try {
        let res = await getSpecificMatch({      
            app: appId,
            match_id: matchId
        });

        return await processResponse(res);
    
    } catch(err){
        console.log(err)
        throw err;
    }
}

export async function getTeam(teamId, slug) {
    try {
        let res = await getSpecificTeam({
            app: appId,
            team_id: teamId,
            slug
        });

        return await processResponse(res);
    
    } catch(err){
        console.log(err)
        throw err;
    }
}