import { find, map, range } from "lodash";
import handleError from "./handleError";
import { processResponse } from "./apiConfig";

export default async function bet({ rollNumber, rollType, betAmount, user }) {
    try {
        const appInfo = JSON.parse(localStorage.getItem("appInfo"));

        const game = find(appInfo.games, { name: "Linear Dice" });

        const maxRoll = rollType === "under" ? rollNumber : 100 - rollNumber;
        const result = map(range(2, maxRoll + 2), index => {
            return { place: index, value: betAmount / maxRoll };
        });
        const response = await user.createBet({
            amount: betAmount,
            result,
            gameId: game._id
        }); 

        await processResponse(response);
        const { winAmount, betAmount : amountBetted, _id : id, nonce } = response.data.message;
        const { index } = response.data.message.outcomeResultSpace;

        return {
            result : rollType === "over" ? 100 - index : index,
            winAmount, 
            nonce,
            betAmount : amountBetted,
            id
        };
    } catch (error) {
        throw error;
    }
}
