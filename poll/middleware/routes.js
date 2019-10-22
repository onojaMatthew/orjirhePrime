const pollRoutes = require( "../routes" );
const error = require( "../config/error" );

module.exports = (app) => {
  app.use( "/poll", pollRoutes );
  app.use( error );
}