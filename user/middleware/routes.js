const userRoutes = require( "../routes" );
const error = require("../config/error")

module.exports = (app) => {
  app.use( "/user", userRoutes );
  app.use( error );
}