// eslint-disable-next-line import/prefer-default-export

const arrayColumn = (arr, number) => arr.map(x => x[number]);

const twoDimensionalArray = [
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15],
  [11, 12, 13, 14, 15],
  [11, 12, 13, 14, 15],
  [11, 12, 13, 14, 15],
  [11, 12, 13, 14, 15]
];

console.log(arrayColumn(twoDimensionalArray, 0));

const matrixResult = []
            const randomTable = (rows, cols) => Array.from(
                {length: rows}, 
                () => Array.from({length: cols}, () => Math.floor(Math.random() * 9))
            )
            
        const arrayColumn = (arr, number) => arr.map(x => x[number]);

        const resultRow = randomTable(5,5)
  
        const resultColumn = arrayColumn(resultRow, 0);
        console.log(resultColumn)

       function onPressResult() {
            const resultRow = randomTable(6,5);
            console.table(resultRow)
            const resultY = arrayColumn(resultRow, 0);
            console.log('Resultado do eixo Y para o indice 0: ' + resultY)
            matrixResult.push(resultRow);
            console.log('Resultado do eixo x para o indice 2: ' + matrixResult[0][2])
        }

export default twoDimensionalArray;
