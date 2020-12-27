import { find, map, range } from "lodash";
import { processResponse } from "../helpers";

export default async function bet({ rollNumber, rollType, betAmount, user }) {
    try {
        const appInfo = JSON.parse(localStorage.getItem("appInfo"));

        const game = find(appInfo.games, { name: "Linear Dice" });

        const initial = rollType === "over" ? rollNumber : 0;
        const finish = rollType === "under" ? rollNumber : 100;
        const maxRoll = finish - initial;
        const result = map(range(0, maxRoll), index => {
            return { place: index, value: betAmount / maxRoll };
        });

        const response = await user.createBet({
            amount: betAmount,
            result,
            gameId: game._id
        }); 

        await processResponse(response);
        const { winAmount, betAmount : amountBetted, _id : id, nonce, user_delta, totalBetAmount } = response.data.message;
        const { key } = response.data.message.outcomeResultSpace;

        return {
            result : (rollType == "under") ? parseInt(key) : (100 - parseInt(key)),
            winAmount, 
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
