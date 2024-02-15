class Service {
    constructor(serviceName, instanceId, ipAddress, port,endPoint) {
        this._serviceName = serviceName;
        this._instanceId = instanceId;
        this._ipAddress = ipAddress;
        this._port = port;
        this._endPoint = endPoint;

    }

    // Getter methods
    get serviceName() {
        return this._serviceName;
    }

    get instanceId() {
        return this._instanceId;
    }

    get ipAddress() {
        return this._ipAddress;
    }

    get port() {
        return this._port;
    }

    get endPoint() {
        return this._endPoint;
    }

    // Setter methods
    set serviceName(serviceName) {
        this._serviceName = serviceName;
    }

    set instanceId(instanceId) {
        this._instanceId = instanceId;
    }

    set ipAddress(ipAddress) {
        this._ipAddress = ipAddress;
    }

    set port(port) {
        this._port = port;
    }

    set endPoint(endPoint) {
        this._endPoint = endPoint;
    }
}

module.exports = { Service };
