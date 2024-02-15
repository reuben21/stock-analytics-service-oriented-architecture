// const {createClient} = require("redis");
// const config = require("../config")
// const client = createClient({
//     username: 'default', // use your Redis user. More info https://redis.io/docs/management/security/acl/
//     password: 'redispw', // use your password here
//     socket: {
//         host: 'localhost',
//         port: 6379
//
//     }
// });
//
// module.exports = {client};

const {createClient} = require("redis");
const config = require("../config");

const client = createClient({
    username: config.redisUsername, // use your Redis user. More info https://redis.io/docs/management/security/acl/
    password: config.redisPassword, // use your password here
    socket: {
        host: config.redisHost,
        port: config.redisPort
    }
});

module.exports = {client};