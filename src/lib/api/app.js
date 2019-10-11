import axios from "axios";
import handleError from "./handleError";
import { apiUrl, apiUrlWithdraw, appId } from "./apiConfig";

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


async function getLastBets({size}) {
    try {
        const response = await axios.post(`${apiUrl}/api/app/lastBets`, {
            app: appId,
            size
        });
    
        return response.data.data.message;
    } catch (error) {
        return handleError(error);
    }
}

async function getBiggestBetWinners({size}) {
    try {
        const response = await axios.post(`${apiUrl}/api/app/biggestBetWinners`, {
            app: appId,
            size
        });
    
        return response.data.data.message;
    } catch (error) {
        return handleError(error);
    }
}

async function getBiggestUserWinners({size}) {
    try {
        const response = await axios.post(`${apiUrl}/api/app/biggestUserWinners`, {
            app: appId,
            size
        });
        return response.data.data.message;
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
  
  

export { 
    getLastBets, 
    getGames, 
    getBiggestUserWinners, 
    getBiggestBetWinners,
    getPopularNumbers 
}