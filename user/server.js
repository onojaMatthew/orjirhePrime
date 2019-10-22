const express = require("express");
const morgan = require("morgan");
const db = require("./config/db");
const bodyParser = require("body-parser");
const cookieParser = require( "cookie-parser" );
const validator = require( "express-validator" );
const app = express();

// creating the server port
const port = process.env.PORT || 3020;

// Setting the server port
app.set("port", port);

// Conecting to database
db()

// middlewares
app.use(morgan("dev"));
app.use( bodyParser.json( { limit: '50mb' } ) );
app.use( bodyParser.urlencoded( { limit: '50mb', extended: true } ) );
app.use( cookieParser() );
app.use( validator() );

//==================================================
// Setting up Cross Origin Resource Sharing
//==================================================
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Authorization, Content-Type, Accept, X-Auth-Token');

  next();
});

app.get("/", (req, res) => {
  res.send({ "message": "Hello from EXPRESS API" });
});

// custom routes
require( "./middleware/routes" )( app );
require( "./config/error-logger" )();

// Listening on a port
app.listen(port, () => console.log(`User Api running on port ${port}`));