/**
 * string
 */
const responseMessages = {
    serverUp: "App is up and running on the configured port ",
    apiHealth: "App is healthy",
    serverError: "ERROR 500 : INTERNAL SERVER ERROR",
    // DB
    mongoConnect: "Connected to MongoDB Database", 
    mongoTerminate: "MongoDB terminated. Process ended",
    mysqlConnect: "Connected to MySql Database",
    mysqlTerminate: "MySql terminated. Process ended",
    mysqlConnectionOnQueue: "MySql connection is on queue",
    mysqlReleased: "MySql released",   
}

export default responseMessages