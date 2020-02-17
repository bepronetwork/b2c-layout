import { find, map, range } from "lodash";
import { processResponse } from "../helpers";

export default async function bet({ amount, user, game_id }) {
    try {
        const appInfo = JSON.parse(localStorage.getItem("appInfo"));
        const game = find(appInfo.games, { _id: game_id });
        const result = new Array(30).fill(0).map( (value, index) => {
            return { 
                place: index, 
                value: parseFloat(parseFloat(amount/30).toFixed(8))
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
