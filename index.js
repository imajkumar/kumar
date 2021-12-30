const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const debug = require('debug')('rest-api-nodejs-mongodb:server');
const http = require('http');
require("dotenv").config();
const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// set up our express app
const app = express();
if(process.env.NODE_ENV !== "test") {
	app.use(logger("dev"));
}
// connect to mongodb

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use('/apiDoc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const apiResponse = require("./helpers/apiResponse");
//To allow cross-origin requests
//To allow cross-origin requests
app.use(cors());

//Route Prefixes
app.use("/", indexRouter);
app.use("/api/", apiRouter);

const db = require("./models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("INFOMATION -🐇 Connected to the database!");
    console.info( `INFOMATION -🚀 Server ready at:${HOST}:${ port }` )
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });



app.all("*", function(req, res) {
	return apiResponse.notFoundResponse(res, "OPPS");
});

const port = normalizePort(process.env.PORT || '4001','0.0.0.0');
const HOST = normalizePort(process.env.HOST);
app.set('port', port);
const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }


  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
  
    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
}

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }
