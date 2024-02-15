const {client} = require("../redis/redisClient");
const {Service} = require("../model/service");

function generateServiceKey(serviceName, instanceId) {
    return `${serviceName}:${instanceId}`;
}

async function registerService(req, res) {
    const {serviceName, instanceId, ipAddress, port, endpoint} = req.body;

    if (!serviceName || !instanceId || !ipAddress || !port || !endpoint) {
        return res.status(400).json({error: 'Missing required fields in the request body'});
    }

    const service = new Service(serviceName, instanceId, ipAddress, port, endpoint);
    const serviceJson = {
        "serviceName": service.serviceName,
        "instanceId": service.instanceId,
        "ipAddress": service.ipAddress,
        "port": service.port,
        "endpoint": service.endPoint,
        "status": "REGISTERING",
        "timestamp": Date.now()
    };
    const multi = client.multi();
    multi.json.set(generateServiceKey(service.serviceName, service.instanceId), '$', serviceJson);
    multi.expire(`${generateServiceKey(service.serviceName, service.instanceId)}`, 60);
    multi.publish('serviceRegistry', JSON.stringify({
        type: 'SERVICE_REGISTRATION',
        key: generateServiceKey(service.serviceName, service.instanceId), values: serviceJson
    }));
    await multi.exec().then(() => {
        return res.json({message: 'Service registered successfully with TTL of 60 seconds'});
    }).catch((err) => {
        console.log(err);
        return res.json({error: err});
    });

}

async function updateHeartbeat(req, res) {
    const {serviceName, instanceId} = req.body;
    const service = new Service(serviceName, instanceId);
    const key = generateServiceKey(service.serviceName, service.instanceId);
    const multi = client.multi();
    const data = multi.json.get(key);
    multi.json.set(key, '$.status',  "RUNNING");
    multi.json.set(key, '$.timestamp',  Date.now());
    const values = await client.json.get(key);
    const serviceJson = {
        "serviceName": values.serviceName,
        "instanceId": values.instanceId,
        "ipAddress": values.ipAddress,
        "port": values.port,
        "endpoint": values.endPoint,
        "status":"RUNNING",
        "timestamp": Date.now()
    };
    multi.publish('serviceRegistry', JSON.stringify({
        type: 'SERVICE_HEARTBEAT',
        key: generateServiceKey(service.serviceName, service.instanceId), values: serviceJson
    }));
    multi.expire(key, 60);
    await multi.exec().then(() => {
        return res.json({message: 'Heartbeat received and timestamp updated'});
    }).catch((err) => {
        return res.json({error: err});
    })

}

async function getServices(req, res) {

    const keys = await client.keys('*:*');
    const serviceInstances = await Promise.all(
        keys.map(async (key) => {
            const values = await client.json.get(key);
            return {key, values};
        })
    );

    return res.json(serviceInstances);
}

async function getServiceByApplicationName(req, res) {
    const {serviceName} = req.params;

    if (!serviceName) {
        return res.status(400).json({error: 'Invalid serviceName parameter'});
    }

    const keys = await client.keys(`${serviceName}:*`);

    const serviceInstances = await Promise.all(
        keys.map(async (key) => {
            const values = await client.json.get(key);
            return {key, values};
        })
    );

    return res.json(serviceInstances);
}

async function deregisterService(req, res) {
    const {serviceName, instanceId} = req.body;
    const service = new Service(serviceName, instanceId);
    if (!serviceName || !instanceId) {
        return res.status(400).json({error: 'Missing required fields in the request body'});
    }
    const key = generateServiceKey(service.serviceName, service.instanceId);
    const exists = await client.exists(key);


    if (exists) {
        await client.persist(key);
        const responseFromKey = await client.json.get(key);
        // console.log("RESPONSE,", responseFromKey);
        await client.json.set(key, '$', {...responseFromKey, status: 'DEREGISTERED'});
        await client.publish('serviceRegistry', JSON.stringify({
            type: 'SERVICE_DE_REGISTRATION', key: key,
            values: responseFromKey
        }));
        // write code to not expire the client anymore

        return res.json({message: 'Service deregistered successfully'});
    } else {
        return res.status(404).json({error: 'Service not found'});
    }
}

module.exports = {
    registerService,
    updateHeartbeat,
    getServices,
    getServiceByApplicationName,
    deregisterService
};
