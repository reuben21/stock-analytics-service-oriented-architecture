# Basic Query Service

### Trade Document Querying Service
##### Offers flexible and powerful querying of stock data

## API
### /query
This services offers one endpoint, query, which is used to query any stock data.

#### Request Parameters
`"queryParams": {}`:

    - Conditions on fields for querying the trade documents:

    **_id** - The unique document ID of the trade, e.g. "d21ccfad4e4097e7dcc430deef765369"

        `"id": <SOME ID>` - search for trade with the specified `_id`

        `"_id": <SOME ID>` - search for trade with the specified `_id`
        
        `"ids": [<SOME ID>, <SOME ID>, ... ]` - search for trades with `_id`s in the list supplied

        `"_ids": [<SOME ID>, <SOME ID>, ... ]` - search for trades with `_id`s in the list supplied

        You can only specify one of the above

    **_rev** - The unique document ID of the trade, e.g. "1-8c65489d1a1a8d1823392539abebfc82"

        `"rev": <SOME REVISION>` - search for specific `_rev`

        `"_rev": <SOME REVISION>` - search for specific `_rev`

        `"revs": [<SOME REVISION>, <SOME REVISION>, ... ]` - search in a set of `_rev`s

        `"_revs": [<SOME REVISION>, <SOME REVISION>, ... ]` - search in a set of `_rev`s

        You can only specify one of the above

    **date** - The date of the trade in YYMMDD format, e.g. 20110429

        `"startTime": <SOME UNIX TIMESTAMP>` - searches for trades after the date of the passed unix timestamp (e.g. 1700163483) as well as the timestamp (see `timestamp`)

        `"endTime": <SOME UNIX TIMESTAMP>` - searches for trades before the date of the passed unix timestamp (e.g. 1700163483) as well as the timestamp (see `timestamp`)

        `"startDate": <SOME DATE>` - searchs for trades after (or on) the supplied date

        `"endDate": <SOME DATE>` - searchs for trades before (or on) the supplied date

        You can not specify both `"startTime"` and `"startDate"` in your query body

        You can not specify both `"endTime"` and `"endDate"` in your query body

    **ticker** - The ticker of the stock traded in the trade, e.g. "aapl"

        `"ticker": <SOME TICKER>` - search for trades with the specific ticker

        `"tickers": [<SOME TICKER>, <SOME TICKER>, ...]` - search for trades with tickers in the list supplied

        You can not specify both `"ticker"` and `"tickers"` in your query body

    **timestamp** - The timestamp of the trade on a given date, in milliseconds since midnight, e.g. 17270000

        // TODO: NEEDS FIX regarding using startTime, endTime

        `"startTime": <SOME UNIX TIMESTAMP>` - in addition to supplying a starting date, the passed unix time (e.g. 1700163483) also calculates condition for `timestamp` 

        `"endTime": <SOME UNIX TIMESTAMP>` - in addition to supplying an ending date, the passed unix time (e.g. 1700163483) also calculates condition for `timestamp` 

        `"startMillisecondsSinceMidnight"` - searchs for trades after (or at) the supplied millisecond count since 00:00

        `"endMillisecondsSinceMidnight"` - searchs for trades before (or at) the supplied millisecond count since 00:00

        You can not specify both `"startTime"` and `"startMillisecondsSinceMidnight"` in your query body

        You can not specify both `"endTime"` and `"endMillisecondsSinceMidnight"` in your query body

    **price** - The price of the stock in US dollars, e.g. 27.60

        `"priceLow": <SOME PRICE>` - searches for trades with prices of at least the supplied value

        `"priceHigh": <SOME PRICE>` - searches for trades with prices of no more than the supplied value

    **size** - The size of the trade, e.g. 500

        `"sizeLow": <SOME SIZE>` - searches for trades with sizes of at least the supplied value

        `"sizeHigh": <SOME SIZE>` - searches for trades with sizes of no more than the supplied value

    **exchange** - The exchange the trade was made on, specified as either:

        - a character correlating to an exchange on the exchange table (see below), e.g. "T"

        - the full name of a known exchange from the exchange table (see below), e.g. NASDAQ Stock Exchange"

        either format works but stick to a single choice if specifying a list

        `"exchange": <SOME EXCHANGE>` - searches for trades on the specified exchange

        `"exchanges": [<SOME EXCHANGE>, <SOME EXCHANGE>, ...]` - searches for trades on any of the specified exchanges

        You can not specify both `"exchange"` and `"exchanges"` in your query body

    **sale_condition** - A string specifying up to 4 sale condition characters, which map according to the sale condition table (see below), e.g. "@F"

        `"saleCondition": <UP TO 4 SALE CONDITION CHARACTERS>` - search for trades matching the specified sale conditions

        `"saleConditions": [<UP TO 4 SALE CONDITION CHARACTERS>, <UP TO 4 SALE CONDITION CHARACTERS>, ...]` - search for trades matching any of the sale condition strings in the list

    **suspicious** - Whether a trade was marked suspicious, 0 or 1

        `"isSuspicious": [<0 or 1>, ...]` - The list can be empty, contain just 0 or 1 or both. Searches for trades matching the list, but empty list is treated as [0, 1]   


`"fields": []`:
    - You can filter which fields to list:
        - `"_id"`
        - `"_rev"`
        - `"date"`
        - `"ticker"`
        - `"timestamp"`
        - `"price"`
        - `"size"`
        - `"exchange"`
        - `"sale_condition"`
        - `"suspicious"`
    By default, full trade document will be returned.

`"sort": []`:
    - You can sort the returned trade information:
    e.g. `"sort" : [{ "size": "asc" }]
    By default the sort `"date": "asc"` is used

`"limit": number`:
    - You can limit the number of trades returned by a query
    e.g. `"limit": 10`
    By default the limit is 100

### Example
```
$ POST http://localhost:8080/api/services/basic-query/query

Request Body (JSON):
{
    "query": {
        "ticker": "csco"
    },
    "fields": [
        "_id",
        "price"
    ]
}

Request Response:
[
    {
        "_id": "d21ccfad4e4097e7dcc430deef765369",
        "price": 211900
    },
    {
        "_id": "f385cff1cd32383a9ad3892cdcae110b",
        "price": 211500
    },
    ...
]
```

## Exchange Table
```
  "A": "NYSE MKT Stock Exchange",
  "B": "NASDAQ OMX BX Stock Exchange",
  "C": "National Stock Exchange",
  "D": "FINRA",
  "I": "International Securities Exchange",
  "J": "Direct Edge A Stock Exchange",
  "K": "Direct Edge X Stock Exchange",
  "M": "Chicago Stock Exchange",
  "N": "New York Stock Exchange",
  "T": "NASDAQ OMX Stock Exchange",
  "P": "NYSE Arca SM",
  "S": "Consolidated Tape System",
  "T": "NASDAQ Stock Exchange",
  "Q": "NASDAQ Stock Exchange",
  "W": "CBOE Stock Exchange",
  "X": "NASDAQ OMX PSX Stock Exchange",
  "Y": "BATS Y-Exchange",
  "Z": "BATS Exchange",
```

## Sale Conditions Table
```
CTS issues:
Blank or ‘@’ - Regular Sale (no condition)
‘B’ = Average Price Trade
‘C’ = Cash Trade (same day clearing)
‘E’ = Automatic Execution
‘F’ = Intermarket Sweep Order
‘G’ = Opening/Reopening Trade Detail
‘H’ = Intraday Trade Detail
‘I’ = CAP Election Trade
‘K’ = Rule 127 trade (NYSE only) or Rule 155 trade
(NYSE MKT only)
‘L’ = Sold Last (late reporting)
‘N’ = Next Day Trade (next day clearing)
‘O’ = Market Center Opening Trade
‘R’ = Seller
‘T’= Extended Hours Trade
‘U’ = Extended Hours (Sold Out of Sequence)
‘Z’ = Sold (out of sequence)
‘4’ - Derivatively Priced
‘5’ – Market Center Re-opening Prints
‘6’ – Market Center Closing Prints
NASD issues:
‘@’ = Regular Trade
‘A’ = Acquisition
‘B’ = Bunched Trade
‘C’ = Cash Trade
‘D’ = Distribution
‘F’ – Intermarket Sweep
‘G’ = Bunched Sold Trade
‘K’ = Rule 155 Trade (NYSE MKT Only)
‘L’ = Sold Last
‘M’ = Market Center Close Price
‘N’ = Next Day
‘O’ = Opening Prints
‘P’ = Prior Reference Price
‘Q’ = Market Center Open Price
‘R’ = Seller (Long-Form Message Formats Only)
‘S’ = Split Trade
‘T’ = Form - T Trade
‘U’ = Extended Hours (Sold Out of Sequence)
‘W’ = Average Price Trade
‘Y’ – Yellow Flag
‘Z’ = Sold (Out of Sequence)
‘1’ = Stopped Stock - Regular Trade
‘2’ = Stopped Stock - Sold Last
‘3’ = Stopped Stock - Sold Last 3 = Stopped Stock - Sold
‘4’ Derivatively Priced
‘5’ – Re-opening Prints
‘6’ – Closing Prints
‘7’ – Placeholder for 611 Exempt
‘8’ - Placeholder for 611 Exempt
‘9’ - Placeholder for 611 Exempt
```
