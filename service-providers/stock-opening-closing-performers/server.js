const express = require('express');

const axios = require('axios');
const config = require('./config');
const mongoDbConnection = require("./mongodb/monoDBConnection");
const app = express();




const SERVICE_REGISTRY_URL = config.serviceRegistryUrl;
const HEALTH_CHECK_INTERVAL = config.healthCheckInterval; // 20 seconds


// Register with the service registry on startup
const registerWithServiceRegistry = async () => {
    const localIpAddress = config.host;
    const serviceName = config.serviceName; // Replace with your service name
    const instanceId = config.instanceId; // Replace with a unique instance ID

    const registrationData = {
        serviceName,
        instanceId,
        ipAddress: localIpAddress,
        port: config.port, // Use the dynamically assigned port
        endpoint: '/', // Replace with the endpoint of your service
    };

    try {
        await axios.post(`${SERVICE_REGISTRY_URL}/api/services/register`, registrationData);
        console.log('Service registered successfully');
    } catch (error) {
        console.error('Failed to register with service registry:', error.message);
    }
};

// Health check (heartbeat) function
const sendHeartbeat = async () => {
    const serviceName = config.serviceName; // Replace with your service name
    const instanceId = config.instanceId; // Replace with your unique instance ID

    try {
        await axios.put(`${SERVICE_REGISTRY_URL}/api/services/heartbeat`, {serviceName, instanceId});
        console.log('Heartbeat sent successfully');
    } catch (error) {
        console.error('Failed to send heartbeat:', error.message);
    }
};


app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    data = [];
    res.render('pages/index',{ data })
})



// Cleanup function to be executed on forced stop
const deregisterFromServiceRegistry = async () => {
    const serviceName = config.serviceName; // Replace with your service name
    const instanceId = config.instanceId; // Replace with the unique instance ID used during registration

    const deregistrationData = {
        serviceName,
        instanceId,
    };

    try {
        await axios.delete(`${SERVICE_REGISTRY_URL}/api/services/deregister`, {data: deregistrationData});
        console.log('Service deregistered successfully');
    } catch (error) {
        console.error('Failed to deregister from service registry:', error.message);
    }
};

// Listen for termination signals
process.on('exit', () => {
    console.log('Process is exiting...');
});

process.on('SIGINT', () => {
    console.log('\nReceived SIGINT signal (Ctrl+C)');
    deregisterFromServiceRegistry()
        .then(r => process.exit(0))
        .catch(e => process.exit(1));
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM signal');
    deregisterFromServiceRegistry()
        .then(r => process.exit(0))
        .catch(e => process.exit(1));
});

process.on('SIGQUIT', () => {
    console.log('Received SIGQUIT signal');
    deregisterFromServiceRegistry()
        .then(r => process.exit(0))
        .catch(e => process.exit(1));
});

app.use('/api', require('./routes/routes'));

mongoDbConnection()
    .then(() => {

        // Start the server
        app.listen(config.port, async () => {



            console.log(`Service provider is running on http://${config.host}:${config.port}`);
            await registerWithServiceRegistry();

            // Schedule the health check every 20 seconds
            setInterval(sendHeartbeat, HEALTH_CHECK_INTERVAL);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });
