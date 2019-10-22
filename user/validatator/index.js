exports.userSignupValidator = ( req, res, next ) => {
  req.check( "firstName", "First name is required" ).notEmpty();
  req.check( "lastName", "Last name is required" ).notEmpty();
  //email
  req.check( "email", "Email must be between 3 to 32 characters" )
    .matches( /.+\@.+\..+/ )
    .withMessage( "Email must contain @" )
    .isLength( {
      min: 4,
      max: 2000
    } );

  // password
  req.check( "password", "Password is required" ).notEmpty()
    .isLength( {
      min: 6,
      max: 32
    } )
    .withMessage( "Password must be at least 6 characters long" );

  const errors = req.validationErrors();

  if ( errors ) {
    const firstError = errors.map( ( error ) => error.msg )[ 0 ];
    return res.status( 400 ).json( {
      error: firstError
    } );
  };

  next();
}
