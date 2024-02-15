const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId},
    id: String,
    date: String,
    ticker: String,
    timestamp: Number,
    price: Number,
    size: Number,
    exchange: String,
    sale_condition: String,
}, { collection: "stock_data" });

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;
