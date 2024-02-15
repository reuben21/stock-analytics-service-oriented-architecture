require("dotenv").config();
const mongoose = require("mongoose");

const MongoDbConnection = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING,{
            dbName: "stock_data",
            autoCreate: false,
        });
        console.log(
            "Database connected: ",
            connect.connection.host,
            connect.connection.name
        );
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

module.exports = MongoDbConnection;