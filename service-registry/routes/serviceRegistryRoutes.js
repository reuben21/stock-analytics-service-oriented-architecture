const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceRegistryController');

// To register a new service instance with the service registry and sets a TTL of 60 seconds
router.post('/register', serviceController.registerService);

// To update the timestamp of a service instance and updates the TTL to another 60 seconds, showing the service is still alive
router.put('/heartbeat', serviceController.updateHeartbeat);

// To get a list of the all service instances that have registered with the service registry
router.get('/list', serviceController.getServices);

// To get a list of all service instances that have registered with the service registry for a specific application
router.get('/list/:serviceName', serviceController.getServiceByApplicationName);

// To deregister a service instance
router.delete('/deregister', serviceController.deregisterService);

module.exports = router;



