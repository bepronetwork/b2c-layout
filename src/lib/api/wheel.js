import { find, map, range } from "lodash";
import handleError from "./handleError";
import { processResponse } from "./apiConfig";

export default async function bet({ amount, user }) {
    try {
        const appInfo = JSON.parse(localStorage.getItem("appInfo"));

        const game = find(appInfo.games, { name: "Wheel" });
        const result = new Array(30).fill(0).map( (value, index) => {
            return { 
                place: index, 
                value: parseFloat(parseFloat(amount/30).toFixed(4))
            };
        });

        const response = await user.createBet({
            result,
            gameId: game._id
        }); 

        await processResponse(response);
        const { winAmount, betAmount : amountBetted, _id : id, nonce } = response.data.message;
        const { index } = response.data.message.outcomeResultSpace;

        return {
            result : index,
            winAmount, 
            nonce,
            isWon : parseFloat(winAmount) != 0,
            betAmount : amountBetted,
            id
        };
    } catch (error) {
        throw error;
    }
}