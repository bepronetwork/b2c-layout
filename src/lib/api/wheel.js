import { find, map, range } from "lodash";
import { processResponse } from "./apiConfig";

export default async function bet({ amount, user, game_id }) {
    try {
        const appInfo = JSON.parse(localStorage.getItem("appInfo"));
        console.log(game_id)
        const game = find(appInfo.games, { _id: game_id });
        console.log(game)
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
