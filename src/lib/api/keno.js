import { find, map, range } from "lodash";
import { processResponse } from "../helpers";

export default async function bet({ cards, betAmount, user }) {
    try {
        const appInfo = JSON.parse(localStorage.getItem("appInfo"));

        const game = find(appInfo.games, { name: "Keno" });

        const result = map(range(0, cards.length), index => {
            return { place: index+1, value: betAmount / cards.length };
        });

        const response = await user.createBet({
            amount: betAmount,
            result,
            gameId: game._id
        }); 

        await processResponse(response);
        const { winAmount, betAmount : amountBetted, _id : id, nonce, user_delta } = response.data.message;
        const { index } = response.data.message.outcomeResultSpace;

        return {
            result : index,
            winAmount, 
            nonce,
            betAmount : amountBetted,
            id,
            userDelta : user_delta
        };
    } catch (error) {
        throw error;
    }
}
