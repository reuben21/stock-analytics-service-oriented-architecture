const express = require('express');
const app = express();
const server = require('http').Server(app);

const bodyParser = require('body-parser');
const cors = require("cors");

const config = require("./config");
const {client} = require("./redis/redisClient");
const serviceRoutes = require('./routes/serviceRegistryRoutes');


const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        credentials: true
    }
});

const subscriber = client.duplicate();
subscriber.connect();

subscriber.subscribe('serviceRegistry', (message) => {

    io.emit("serviceRegistry", message);

     //console.log(message); // 'message'
});


const port = config.port;


const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

app.use(bodyParser.json());

app.use("/api/services", serviceRoutes);

server.listen(port, async () => {
    // console.log(`Express server is running on port ${port}`);
    // client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect()
        .then(() => console.log('Redis client connected'))
        .catch((err) => console.log('Redis client error', err));
    console.log(`Express server is running on port ${port}`);
});
