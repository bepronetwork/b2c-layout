import axios from "axios";
import handleError from "./handleError";
import { apiUrl, appId } from "./apiConfig";

export default async function getAppInfo() {
    try {
        const response = await axios.post(`${apiUrl}/api/app/get`, {
            app: appId
        });

        return response.data.data.message;
    } catch (error) {
        return handleError(error);
    }
}


async function getGames(){
    try {
        const response = await axios.post(`${apiUrl}/api/app/games/getAll`, {
            app: appId
        });

        return response.data.data.message;
    } catch (error) {
        return handleError(error);
    }
}


async function getLastBets({size, game}) {
    try {
        const response = await axios.post(`${apiUrl}/api/app/lastBets`, {
            app: appId,
            size,
            game
        });

        if(response.data.data.message.hasOwnProperty('lastBets')) {
            return response.data.data.message.lastBets;
        }
        else {
            return [];
        }
        
    } catch (error) {
        return handleError(error);
    }
}

async function getBiggestBetWinners({size, game}) {
    try {
        const response = await axios.post(`${apiUrl}/api/app/biggestBetWinners`, {
            app: appId,
            size,
            game
        });

        if(response.data.data.message.hasOwnProperty('biggestBetWinner')) {
            return response.data.data.message.biggestBetWinner;
        }
        else {
            return [];
        }

    } catch (error) {
        return handleError(error);
    }
}

async function getBiggestUserWinners({size, game}) {
    try {
        const response = await axios.post(`${apiUrl}/api/app/biggestUserWinners`, {
            app: appId,
            size,
            game
        });

        if(response.data.data.message.hasOwnProperty('biggestUserWinner')) {
            return response.data.data.message.biggestUserWinner;
        }
        else {
            return [];
        }

    } catch (error) {
        return handleError(error);
    }
}

async function getPopularNumbers({size}) {
    try {
        const response = await axios.post(`${apiUrl}/api/app/popularNumbers`, {
            app: appId,
            size
        });
        return response.data.data.message;
    } catch (error) {
        return handleError(error);
    }
}

async function ping() {
    try {
        const response = await axios.post(`${apiUrl}/api/status/post`, {
            app: appId,
            type: "user"
        });
            
        return response.data.data.status;

    } catch (error) {
        return handleError(error);
    }
}

async function getBet({betId}) {
    try {
        const response = await axios.post(`${apiUrl}/api/app/bet/get`, {
            app: appId,
            bet: betId
        });
            
        return response.data.data;

    } catch (error) {
        return handleError(error);
    }
}
  
export { 
    getLastBets, 
    getGames, 
    getBiggestUserWinners, 
    getBiggestBetWinners,
    getPopularNumbers,
    ping,
    getBet
}