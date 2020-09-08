import { find } from "lodash";
import { processResponse } from "../helpers";

export default async function bet({ amount, user, game_id }) {
  try {
    const appInfo = JSON.parse(localStorage.getItem("appInfo"));
    const game = find(appInfo.games, { _id: game_id });
    const result = new Array(7).fill(0).map((value, index) => {
      return {
        place: index,
        value: amount / 7
      };
    });

    const response = await user.createBet({
      amount,
      result,
      gameId: game._id
    });

    await processResponse(response);
    const {
      winAmount,
      betAmount: amountBetted,
      _id: id,
      nonce,
      user_delta
    } = response.data.message;
    const { index } = response.data.message.outcomeResultSpace;

    console.log(index);

    return {
      result: index,
      winAmount,
      nonce,
      isWon: parseFloat(winAmount) !== 0,
      betAmount: amountBetted,
      id,
      userDelta: user_delta
    };
  } catch (error) {
    throw error;
  }
}
