const express = require('express');
const app = express();
const server = require('http').Server(app);
const path = require('path');

const bodyParser = require('body-parser');
const cors = require("cors");

const config = require("./config");

const consumerAPIRoutes = require('./routes/consumerAPIRoutes');
const searchEngineRoutes = require('./routes/searchEngineRoutes');

const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}
app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'pug');
app.use(cors(corsOptions)) // Use this after the variable declaration

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.redirect('/search');
});

app.use("/search", searchEngineRoutes);
app.use("/api", consumerAPIRoutes);

server.listen(config.consumer_port, async () => {
    console.log(`Express server is running on port ${config.consumer_port}`);
});
