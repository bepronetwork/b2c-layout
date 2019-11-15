import { find, map, range } from "lodash";
import handleError from "./handleError";
import { processResponse } from "./apiConfig";


const rows          = 10;
const formType      = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
const probability   = [0.4, 0.267, 0.133, 0.067, 0.067, 0.033, 0.033, 0.133, 0.267, 0.4];
const multiplier    = [0.1, 0.6, 1, 1.5, 2, 3, 10, 1, 0.6, 0.1];
const amount        = [12, 8, 4, 2, 2, 1, 1, 4, 8, 12];

export default async function bet({ betAmount, user }) {
    try {
        const appInfo = JSON.parse(localStorage.getItem("appInfo"));

        const game = find(appInfo.games, { name: "Plinko" });

        /*
        //init remove mock to plinko
        const resultSpace = map(range(0, rows), index => {
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

        const result = map(range(0, rows), index => {
            return { formType: formType[index], probability: probability[index], multiplier: multiplier[index], amount: amount[index]};
        });
        const result = map(range(0, rows), index => {
            return { place: index, value: betAmount / rows };
        });
        //finish remove mock to plinko
        */

        const result = map(range(0, rows), index => {
            return { formType: formType[index], probability: probability[index], multiplier: multiplier[index], amount: amount[index]};
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
