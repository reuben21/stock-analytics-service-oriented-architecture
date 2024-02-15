const topBottomQuery = require('../services/top-bottom-performer/top-bottom-service');

const fs = require('fs');
const filePath = './controllers/tickerList.txt';
const resultArr = [];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function executeTopBottomQuery(req, res, next){

  fs.readFile(filePath, 'utf-8', async (err, data) => {
    if (err) {
      console.log('Error reading file:', err);
    } 
  const tickerArray = data.split('\n').map(symbol => symbol.trim());
  
      if (req.body) {
        try {
          req.body.query.tickers = tickerArray
          endDate = req.body.query.endDate;
          req.body.query.endDate = req.body.query.startDate;
          queryBody = {
            queryParams: req.body.query,
            fields: req.body.fields,
            sort: req.body.sort,
            limit: 10000000000,
          };
          const resultStart = await topBottomQuery.query(queryBody);
          req.body.query.startDate = endDate;
          req.body.query.endDate = endDate;
          queryBody = {
            queryParams: req.body.query,
            fields: req.body.fields,
            sort: req.body.sort,
            limit: 10000000000,
          };
          const resultEnd = await topBottomQuery.query(queryBody);
          const groupByTickerStart = []
          const groupByTickerEnd = []

          for (let j = 0; j < tickerArray.length; j++){
            let tempArr = []
            for (let i = 0; i < resultStart.length; i++){
              if (tickerArray[j] === resultStart[i].ticker){
                tempArr.push(resultStart[i].price);
              }
            }
            groupByTickerStart.push(tempArr);
          }

          for (let j = 0; j < tickerArray.length; j++){
            let tempArr = []
            for (let i = 0; i < resultEnd.length; i++){
              if (tickerArray[j] === resultEnd[i].ticker){
                tempArr.push(resultEnd[i].price);
              }
            }
            groupByTickerEnd.push(tempArr);
          }

          for (let i = 0; i < groupByTickerStart.length; i++){
            value = (groupByTickerEnd[i][groupByTickerEnd[i].length-1] - groupByTickerStart[i][0]) / groupByTickerStart[i][0] * 100;
            value = Math.round((value + Number.EPSILON)*100)/100;
            resultArr.push(tickerArray[i] + ":" + value);
          }
          let temp = []

          for(let i = 0; i < resultArr.length; i++){
            if (resultArr[i].split(":")[1] != "NaN"){
              temp.push(resultArr[i])
            }
          }

        temp.sort((a, b) => {
          const valueA = parseFloat(a.split(":")[1]);
          const valueB = parseFloat(b.split(":")[1]);
          return valueB - valueA;
        });

        result = "Top 3 Performers were: " + temp[0] + "% " + temp[1] + "% " + temp[2] + '% \n ' + "Bottom 3 Performers were: " + temp[temp.length - 1] + "% " + temp[temp.length - 2] + "% " +temp[temp.length - 3] + "%"
        res.status(200).json(result);
        } catch (error) {
          console.error('Error executing query:', error);
          res.status(500).json({ error: 'Error executing query.' });
        }

      } else {
        return res.status(400).json({ error: 'No query provided in the request body.' });
      }
})
  }

module.exports = {
  executeTopBottomQuery,
};