const winston = require( 'winston' );
require( 'winston-mongodb' );
require( 'express-async-errors' );
require( "dotenv" );

module.exports = function () {
  winston.handleExceptions(
    new winston.transports.File( { filename: 'uncaughtException.log' } ),
    new winston.transports.Console( { colorize: true, prettyPrint: true } )
  )

  process.on( 'unhandledRejection', ( ex ) => {
    throw ex;
  } );

  winston.add( winston.transports.File, { filename: 'logFile.log' } );
  winston.add( winston.transports.MongoDB, {
    db: process.env.DB_URL,
    level: 'info'
  } );
}