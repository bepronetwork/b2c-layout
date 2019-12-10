import { forEach, map, find } from "lodash";
import handleError from "./handleError";
import { processResponse } from "../helpers";

const boardCellsNumbers = {
  colorRed: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],
  colorBlack: [
    2,
    4,
    6,
    8,
    10,
    11,
    13,
    15,
    17,
    20,
    22,
    24,
    26,
    28,
    29,
    31,
    33,
    35
  ],
  parityEven: [
    2,
    4,
    6,
    8,
    10,
    12,
    14,
    16,
    18,
    20,
    22,
    24,
    26,
    28,
    30,
    32,
    34,
    36
  ],
  parityOdd: [
    1,
    3,
    5,
    7,
    9,
    11,
    13,
    15,
    17,
    19,
    21,
    23,
    25,
    27,
    29,
    31,
    33,
    35
  ],
  row1: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
  row2: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
  row3: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
  range0118: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  range1936: [
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36
  ],
  range0112: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  range1324: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
  range2536: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]
};

function getBetOnEachNumber(betHistory) {
    const totalBetOnEachCell = {};

    /* eslint-disable no-unused-expressions  */

    forEach(betHistory, ({ cell, chip }) => {
        totalBetOnEachCell[cell]
        ? (totalBetOnEachCell[cell] += chip)
        : (totalBetOnEachCell[cell] = chip);
    });

    let finalBetOnEachNumber = [];

    forEach(totalBetOnEachCell, (value, key) => {
        !boardCellsNumbers[key]
        ? (finalBetOnEachNumber = [
            ...finalBetOnEachNumber,
            { place: Number(key), value }
            ])
        : (finalBetOnEachNumber = [
            ...finalBetOnEachNumber,
            ...map(boardCellsNumbers[key], boardNumber => {
                return {
                    place: boardNumber,
                    value: value / boardCellsNumbers[key].length
                };
            })
            ]);
    });
    let distributedBetOnEachNumber = finalBetOnEachNumber.reduce( (array, el) => {
        var equalEl = array.find( currentEl => (currentEl.place == el.place));
        if(equalEl){
            array.splice( array.indexOf(equalEl, 1), 1);
            let newEl = {
                place : el.place,
                value: parseFloat(el.value) + parseFloat(equalEl.value)
            }
            array.push(newEl);
            return array;
        }else{
            array.push(el);
            return array;
        }
    }, []).filter( el => el != null);
    /* eslint-enable no-unused-expressions */
    return distributedBetOnEachNumber;
}

export default async function bet({ betHistory, betAmount, user }) {
    try {
        const betOnEachNumber = getBetOnEachNumber(betHistory);
        const appInfo = JSON.parse(localStorage.getItem("appInfo"));
        
        const game = find(appInfo.games, { name: "Roulette" });
                
        const response = await user.createBet({
            amount: betAmount,
            result: betOnEachNumber,
            gameId: game._id
        });

        await processResponse(response);

        const { winAmount, betAmount : amountBetted, _id : id, isWon } = response.data.message;
        const { index } = response.data.message.outcomeResultSpace;

        return {
            result : index,
            winAmount, 
            isWon,
            betAmount : amountBetted,
            id
        };
    } catch (error) {
        console.log(error);
        throw error;
    }
}
