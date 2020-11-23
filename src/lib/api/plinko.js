import { find, map, range } from "lodash";
import handleError from "./handleError";
import { processResponse } from "../helpers";


export default async function bet({ betAmount, user }) {
    try {
        const appInfo = JSON.parse(localStorage.getItem("appInfo"));

        const game = find(appInfo.games, { metaName: "plinko_variation_1" });
        const gameResultSpaceLength = game.resultSpace.length;

        const result = new Array(gameResultSpaceLength).fill(0).map( (value, index) => {
            return { 
                place: index, 
                value: parseFloat(parseFloat(betAmount/gameResultSpaceLength))
            };
        });
        const response = await user.createBet({
            amount: betAmount,
            result,
            gameId: game._id
        }); 

        await processResponse(response);
        const { winAmount, betAmount : amountBetted, _id : id, nonce, isWon, user_delta, totalBetAmount } = response.data.message;
        const { index } = response.data.message.outcomeResultSpace;

        return {
            result : index,
            winAmount, 
            isWon,
            nonce,
            betAmount : amountBetted,
            id,
            userDelta : user_delta,
            totalBetAmount
        };
    } catch (error) {
        throw error;
    }
}
