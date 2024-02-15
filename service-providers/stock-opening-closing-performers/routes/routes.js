const express = require("express");
const router = express.Router();
const StockPerformerController = require("../controllers/top-stock-performer-contoller");

router.get(
    "/top-performing-stocks/morning",
    StockPerformerController.openingTimeTopStockPerformer
);

router.get(
    "/top-performing-stocks/evening",
    StockPerformerController.closingTimeTopStockPerformer
);

module.exports = router;
