import { find } from "lodash";
import { processResponse } from "../helpers";

export default async function bet({ betAmount, side, user }) {
    try {
        const appInfo = JSON.parse(localStorage.getItem("appInfo"));

        const game = find(appInfo.games, { name: "CoinFlip" });

        const result = [
            { place: side === "tails" ? 0 : 1, value: Number(betAmount) }
        ];

        const response = await user.createBet({
            amount: betAmount,
            result,
            gameId: game._id
        });
        await processResponse(response);
        
        const { message } = response.data;
        const { winAmount, betAmount : amountBetted, _id : id, isWon, outcomeResultSpace, user_delta } =message;
        const { index } = outcomeResultSpace;

        return {
            result : index === 1 ? "heads" : "tails",
            hasWon: isWon,
            winAmount, 
            betAmount : amountBetted,
            id,
            userDelta : user_delta
        };
    } catch (error) {
        throw error;
    }
}
