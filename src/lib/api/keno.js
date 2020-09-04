import { find, map, range } from "lodash";
import { processResponse } from "../helpers";

export default async function bet({ cards, betAmount, user }) {
    try {
        const appInfo = JSON.parse(localStorage.getItem("appInfo"));

        const game = find(appInfo.games, { name: "Keno" });

        const result = cards.map( card => {
            return { place: card.id, value: betAmount / cards.length };
        });

        const response = await user.createBet({
            amount: betAmount,
            result,
            gameId: game._id
        }); 

        await processResponse(response);
        const { winAmount, isWon, betAmount : amountBetted, _id : id, nonce, user_delta, outcomeResultSpace } = response.data.message;

        const index = outcomeResultSpace.map( r => {
            return r.index;
        });
        console.log(index);
        return {
            result : index,
            winAmount, 
            isWon,
            nonce,
            betAmount : amountBetted,
            id,
            userDelta : user_delta
        };
    } catch (error) {
        throw error;
    }
}
