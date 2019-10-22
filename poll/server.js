const express = require("express");
const db = require("./config/db");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const app = express();

const port = process.env.PORT || 3030;
db();

app.set("port", port);
app.use( express.static( __dirname ) );
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
  res.json({ success: "Hello from EXPRESS API" });
});

// Custom routes
require( "./middleware/routes" )( app );
// Error logger
require( "./config/error-logger" )();

app.listen(port, () => {
  console.log(`Poll api running on port ${port}`);
});