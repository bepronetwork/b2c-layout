import { find, map, range } from "lodash";
import handleError from "./handleError";
import { processResponse } from "./apiConfig";

export default async function bet({ rows, risk, betAmount, user }) {
    try {
        const appInfo = JSON.parse(localStorage.getItem("appInfo"));

        //init remove mock to plinko
        //const game = find(appInfo.games, { name: "Plinko" });
        const resultSpace = map(range(0, 10), index => {
            return { id: "5d98ac6e4470590bcc57a0" + index, formType: index, probability: 0.01, color: "red"};
        });
        const game = {_id:"5d98ac6e4470590bcc57a09c",
                        description:"Plinko",
                        edge:10,
                        image_url:"https://storage.googleapis.com/betprotocol-game-images/001-dices.png",
                        isClosed:false,
                        metaName:"plinko_simple",
                        name:"Plinko",
                        resultSpace: resultSpace,
                        tableLimit:30
                    }
        //finish remove mock to plinko

        const maxRoll = 10;
        const result = map(range(0, maxRoll), index => {
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
            result : index,
            winAmount, 
            nonce,
            betAmount : amountBetted,
            id
        };
    } catch (error) {
        throw error;
    }
}
