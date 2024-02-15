const FIELD_NAMES = [
    '_id',
    '_rev',
    'date',
    'ticker',
    'timestamp',
    'price',
    'size',
    'exchange',
    'sale_condition',
    'suspicious',
  ];
  
  const DATE_MIN = "00000000";
  const DATE_MAX = "99999999";
  
  const TIMESTAMP_MIN = 0;
  const TIMESTAMP_MAX = 86399999;
  const PRICE_MIN = 0;
  const PRICE_MAX = 9999999999;
  const SIZE_MIN = 0;
  const SIZE_MAX = 9999999999;
  
  const EXCHANGE_MAP = {
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
  }
  
  const INVERSE_EXCHANGE_MAP = {
    "NYSE MKT Stock Exchange": "A",
    "NASDAQ OMX BX Stock Exchange": "B",
    "National Stock Exchange": "C",
    "FINRA": "D",
    "International Securities Exchange": "I",
    "Direct Edge A Stock Exchange": "J",
      "Direct Edge X Stock Exchange": "K",
      "Chicago Stock Exchange": "M",
      "New York Stock Exchange": "N",
      "NASDAQ OMX Stock Exchange": "T",
      "NYSE Arca SM": "P",
      "Consolidated Tape System": "S",
      "NASDAQ Stock Exchange": "T",
      "NASDAQ Stock Exchange": "Q",
      "CBOE Stock Exchange": "W",
      "NASDAQ OMX PSX Stock Exchange": "X",
      "BATS Y-Exchange": "Y",
      "BATS Exchange": "Z",
  }
  
  const TRUE_VALUES = ['true', 'True', 'TRUE', '1', 1, true];
  const FALSE_VALUES = ['false', 'False', 'FALSE', '0', 0, false];
  const ALL_VALUES = ['all', 'All', 'ALL', -1, undefined];
  
  const PRICE_MULTIPLIER = 10000;
  
  module.exports = {
    FIELD_NAMES,
    DATE_MIN,
    DATE_MAX,
    TIMESTAMP_MIN,
    TIMESTAMP_MAX,
    PRICE_MIN,
    PRICE_MAX,
    SIZE_MIN,
    SIZE_MAX,
    EXCHANGE_MAP,
    INVERSE_EXCHANGE_MAP,
    TRUE_VALUES,
    FALSE_VALUES,
    ALL_VALUES,
    PRICE_MULTIPLIER,
  };
  