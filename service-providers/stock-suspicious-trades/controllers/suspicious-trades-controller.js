const suspiciousTradesQuery = require('../services/suspicious-trades-services/suspicious-trades-service');

const fs = require('fs');
const filePath = './controllers/tickerList.txt';
const resultArr = [];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function executeSuspiciousTradesQuery(req, res, next){

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
          const resultStart = await suspiciousTradesQuery.query(queryBody);
          req.body.query.startDate = endDate;
          req.body.query.endDate = endDate;
          queryBody = {
            queryParams: req.body.query,
            fields: req.body.fields,
            sort: req.body.sort,
            limit: 10000000000,
          };
          const resultEnd = await suspiciousTradesQuery.query(queryBody);

          const suspiciousTrades = [];

          for (let j = 0; j < tickerArray.length; j++) {
            let tempArr = [];
            for (let i = 0; i < resultEnd.length; i++) {
              if (tickerArray[j] === resultEnd[i].ticker && resultEnd[i].suspicious === 1) {
                tempArr.push(resultEnd[i]);
              }
            }
            suspiciousTrades.push(...tempArr);
          }

          suspiciousTrades.sort((a, b) => b.size - a.size);
          const top10SuspiciousTrades = suspiciousTrades.slice(0, 10);
          returnValue = ""

          if (top10SuspiciousTrades.length === 0){
            returnValue = "No suspicious trades found";
          }
          else{
            returnValue = top10SuspiciousTrades;
          }
          res.status(200).json(returnValue);

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
  executeSuspiciousTradesQuery,
};