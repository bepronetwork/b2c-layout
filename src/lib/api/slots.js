import { find } from "lodash";
import { processResponse } from "../helpers";

export default async function bet({ amount, user, game_id }) {
  try {
    const appInfo = JSON.parse(localStorage.getItem("appInfo"));

    const game = find(appInfo.games, { _id: game_id });

    const result = new Array(13).fill(0).map((value, index) => {
      return {
        place: index,
        value: amount / 13
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
      isWon,
      betAmount: amountBetted,
      _id: id,
      nonce,
      user_delta,
      outcomeResultSpace
    } = response.data.message;

    const index = outcomeResultSpace.map(r => {
      return r.index;
    });

    return {
      result: index,
      winAmount,
      isWon,
      nonce,
      betAmount: amountBetted,
      id,
      userDelta: user_delta
    };
  } catch (error) {
    throw error;
  }
}
