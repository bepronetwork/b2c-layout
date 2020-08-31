import { find } from "lodash";
import { processResponse } from "../helpers";

export default async function bet({ amount, user, gameId }) {
  try {
    const appInfo = JSON.parse(localStorage.getItem("appInfo"));
    const game = find(appInfo.games, { _id: gameId });
    const result = new Array(30).fill(0).map((value, index) => {
      return {
        place: index,
        value: parseFloat(amount / 30)
      };
    });

    const response = await user.createBet({
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
