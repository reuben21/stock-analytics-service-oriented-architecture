# Service Registry

## Setting up Redis
1. Setup Redis database through Docker
    1. `docker pull redis` 
   2. `docker run --name redis -p 6379:6379 -d redis` here the name part can be changed to anything, so it can be --name xyz-redis
   3. `docker exec -it redis redis-cli` username is `deafult` and password `redispw`, here if you face any error, then make sure  the command is "docker exec -it <redis name you gave above> redis-cli"
   4. Client connection for redis is setup in redis folder in `redis.js`
   5. `ping` should return `PONG`
   6. `exit`
2. run the service registry with `npm start`


# Service Registry API

The Service Registry API provides endpoints for registering, updating, listing, and deregistering service instances in a registry. It is designed to manage the lifecycle of services and keep track of their availability.

## Table of Contents

1. [API Endpoints](#api-endpoints)
    - [Register a New Service Instance](#register-a-new-service-instance)
    - [Update Service Heartbeat](#update-service-heartbeat)
    - [List All Service Instances](#list-all-service-instances)
    - [Deregister a Service Instance](#deregister-a-service-instance)


4. The server will be running at `http://localhost:3000`.

## API Endpoints

### Register a New Service Instance

To register a new service instance with the service registry and set a TTL of 60 seconds, make a `POST` request to the following endpoint:

```
POST http://localhost:3000/api/services/register
```

**Request Body:**

```json
{
  "serviceName": "example-service",
  "instanceId": "123",
  "ipAddress": "192.168.1.1",
  "port": 8080
}
```

### Update Service Heartbeat

To update the timestamp of a service instance and extend the TTL to another 60 seconds, making it clear that the service is still alive, make a `PUT` request to the following endpoint:

```
PUT http://localhost:3000/api/services/heartbeat
```

**Request Body:**

```json
{
  "serviceName": "example-service",
  "instanceId": "123"
}
```

### List All Service Instances

To get a list of all service instances that have registered with the service registry, make a `GET` request to the following endpoint:

```
GET http://localhost:3000/api/services/list
```
### List All Service Instances By Service Name

To get a list of all service instances that have registered with the service registry with a specific Service Name.
```
GET http://localhost:3000/api/services/list/:serviceName
```
The response will include details about each registered service instance.

### Deregister a Service Instance

To deregister a service instance, make a `DELETE` request to the following endpoint:

```
DELETE http://localhost:3000/api/services/deregister
```

**Request Body:**

```json
{
  "serviceName": "example-service",
  "instanceId": "123"
}
```

---

Feel free to customize this README to fit your specific project structure and details.