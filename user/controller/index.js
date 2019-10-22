const { User } = require("../models");
const bcrypt = require( "bcrypt" );
const fetch = require( "node-fetch" );

// Handles user acount registration
exports.signup = (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const { userType } = req.params;

  if (!email || !password) return res.status(400).json({ error: "Email and password are required for account sign up" });
  if (!userType) return res.status(400).json({ error: "User unknown" });
  let user_type;
  let role;
  
  User.findOne({ email })
    .then( user => {
      // We check if a user with the email @email is already taken, if so return the error message
      if ( user ) return res.status( 400 ).json( { error: "User already exists" } );
      // hash the new password @password with complexity of 12
      return bcrypt.hash( password, 12 )
        .then( hashedPassword => {
          // check if hashing was successful, if not return the error message
          if ( !hashedPassword ) return res.status( 400 ).json( { error: "Something went wrong" } );
          if ( userType === "user" ) {
            user_type = "user";
            role = "user";
          } else {
            user_type = "admin";
           role = "admin";
          }

          // save the new user to the user model
          let newUser = new User( {
            firstName: firstName,
            lastName: lastName,
            email,
            password: hashedPassword,
            userType: user_type,
            role
          } );
          newUser.save();
          // We generate a token for the new user
          const token = newUser.generateToken();
          
          // Set the header and return the user
          res.header( "x-auth-token", token).json( newUser );
        } );
    })
    .catch(err => {
      res.json({ error: err.message });
    });
}

// Handles user account login
exports.signin = (req, res) => {
  const { email, password } = req.body;

  // check for email and password in the req.body
  if ( !email || !password ) return res.status( 400 ).json( { error: "Email and password are required" } );

  User.findOne({ email })
    .then(user => {
      if ( !user ) return res.status( 400 ).json( { error: "User does not exist" } );
      /**
       * We compare the current password @password with the password in the database
       * if they are not the same, return the error message
      */
      return bcrypt.compare(password, user.password)
        .then(isMatch => {
          if ( !isMatch ) return res.status( 400 ).json( { error: "Invalid email or password" } );
          /**
           * We get the user token @user.generatetoken() send it with the json response
           */
          const token = user.generateToken();
          const { _id, email, firstName, lastName, userType, role } = user;
          res.cookie( "token", token, { expire: new Date() + 9999 } );
          // We respond 
          res.json( { token, user: { _id, email, userType, role, firstName, lastName }});
        });
    })
    .catch(err => {
      res.json({ error: err.message });
    });
}

/**
 * This fetches all users
 */
exports.fetchAllUsers = ( req, res ) => {
  User.find( {} )
    .select("firstName lastName email userType role createdAt")
    .then( users => {
      if ( !users ) return res.status( 400 ).json( { error: "User list is empty" } );
      res.json( users );
    } )
    .catch( err => {
      res.json( err.message );
    } );
}

/**
 * Gets a user with the userId params
 */
exports.getUser = ( req, res ) => {
  const { userId } = req.params;
  if ( !userId ) return res.status( 400 ).json( { error: "Request failed. No user ID provided" } );
  User.findById( { _id: userId } )
    .then( user => {
      if ( !user ) return res.status( 400 ).json( { error: `No user found with the ID ${ userId }` } );
      res.json( user );
    } )
    .catch( err => {
      res.json( { error: err.message } );
    } );
}

/**
 * Deletes user with the ID @param userId
 */
exports.userDelete = ( req, res ) => {
  const { userId, userType } = req.params;
  console.log(userId, userType)
  if ( !userId ) return res.status( 400 ).json( { error: "User ID not provided" } );
  if ( !userType ) return res.status( 400 ).json( { error: "Only admin is allowed to delete a user"})
  User.findByIdAndDelete( {_id: userId} )
    .then( user => {
      if ( !user ) return res.status( 400 ).json( {
        error: "Operation failed. Please tr again."
      } );
      res.json( user );
    } )
    .catch( err => {
      res.json( err.message );
    } );
}

/**
 * user account log out
 */
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({ "message": "You have logged out successfully" });
};

exports.createPoll = ( req, res ) => {
  // We destructure @userId and @usertype from request params
  const { userId, userType, pollId } = req.params;
  const { user: { _id } } = req;
  
  // We destructure @name from request body
  const { name } = req.body;
  // We check for the poll name in the request body. If not proveded, we return the error message
  if ( !name ) return res.status( 400 ).json( { error: "Name is not provided. A poll must have a name" } );
  // We check the user type. If it's not admin, return the error message
  if ( userType !== "admin" ) return res.status( 400 ).json( { error: "Only an admin allowed for this operation" } );
  if ( userId !== _id ) return res.status( 400 ).json( {
    error: "Unknow user ID. Please create an account if you don't have one "
  } );

  /**
   * We make a call to the poll service to create a new poll
   */
  fetch( `http://localhost:3030/poll/create/${ userId }/${ userType }/${pollId}`, { 
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ACCEPT: "application/json"
    },
    body: JSON.stringify(req.body)
  } )
    .then(response => response.json())
    .then( resp => {
      res.json( resp );
    } )
    .catch( err => {
      res.json( { error: err.message } );
    } );
}

/**
 * A call the poll service to like the poll with @param pollId
 */
exports.likePoll = ( req, res ) => {
  // We destructure @userId and @usertype from request params
  const { pollId, userId, userType } = req.params;
  const { user: { _id } } = req;
  // We destructure @name from request body
  
  // We check for the poll name in the request body. If not proveded, we return the error message
  if ( !pollId ) return res.status( 400 ).json( { error: "Poll ID is not provided." } );
  // We check the user type. If it's not admin, return the error message
  if ( userType !== "user" ) return res.status( 400 ).json( { error: "Only users allowed for this operation" } );
  if ( userId !== _id ) return res.status( 400 ).json( {
    error: "Unknow user ID. Please create an account if you don't have one "
  } );

  /**
   * We make a call to the poll service to like the poll with @param pollId
   */
  fetch( `http://localhost:3030/poll/like/${ userType }/${ pollId }/${ userId }`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ACCEPT: "application/json"
    }
  } )
    .then(response => response.json())
    .then( resp => {
      if ( !resp ) return res.status( 400 ).json( { error: "Operaion failed. Try again" } );
      res.json( resp );
    } )
    .catch( err => {
      res.json( { error: err.message } );
    } );
}

/**
 * We make to the poll service to vote the poll with @param pollId
 */
exports.votePoll = ( req, res ) => {
  // We destructure @userId and @usertype from request params
  const { pollId, userId, userType } = req.params;
  const { user: { _id } } = req;
  // We destructure @name from request body

  // We check for the poll name in the request body. If not proveded, we return the error message
  if ( !pollId ) return res.status( 400 ).json( { error: "Poll ID is not provided." } );
  // We check the user type. If it's not admin, return the error message
  if ( userType !== "user" ) return res.status( 400 ).json( { error: "Only users allowed for this operation" } );
  if ( userId !== _id ) return res.status( 400 ).json( {
    error: "Unknow user ID. Please create an account if you don't have one "
  } );

  /**
   * We make a call to the poll service to vote the poll with @param pollId
   */
  fetch( `http://localhost:3030/poll/vote/${ userType }/${ pollId }/${ userId }`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ACCEPT: "application/json"
    }
  } )
    .then(response => response.json())
    .then( resp => {
      if ( resp.error ) return res.status( 400 ).json( { error: resp.error } );
      res.json( resp );
    } )
    .catch( err => {
      res.json( { error: err.message } );
    } );
}

/**
 * We make a call to the poll service to add tags to the poll with @param pollId
 */
exports.tagsPoll = ( req, res ) => {
  // We destructure @userId and @usertype from request params
  const { pollId, userType, userId } = req.params;
  const { user: { _id } } = req;
  
  // We check for the poll name in the request body. If not proveded, we return the error message
  if ( !pollId ) return res.status( 400 ).json( { error: "Poll ID is not provided." } );
  // We check the user type. If it's not admin, return the error message
  if ( userType !== "admin" ) return res.status( 400 ).json( { error: "Only admin is allowed for this operation" } );
  if ( userId !== _id ) return res.status( 400 ).json( {
    error: "Unknow user ID. Please create an account if you don't have one "
  } );

  /**
   * We make a call to the poll service to vote the poll with @param pollId
   */
  fetch( `http://localhost:3030/poll/tags/${ userType }/${ pollId }/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ACCEPT: "application/json"
    },
    body: JSON.stringify( req.body)
  } )
    .then(response => response.json())
    .then( resp => {
      if ( !resp ) return res.status( 400 ).json( { error: "Failed update tags."})
      res.json( resp );
    } )
    .catch( err => {
      res.json( { error: err.message } );
    } );
}

/**
 * We make a call to the poll service to disable the poll with @param pollId
 */
exports.disablePoll = ( req, res ) => {
  // We destructure @userId and @usertype from request params
  const { pollId, userId, userType } = req.params;
  const { user: { _id } } = req;
  
  // We check for the poll name in the request body. If not proveded, we return the error message
  if ( !pollId ) return res.status( 400 ).json( { error: "Poll ID is not provided." } );
  // We check the user type. If it's not admin, return the error message
  if ( userType !== "admin" ) return res.status( 400 ).json( { error: "Only admin is allowed for this operation" } );
  if ( userId !== _id ) return res.status( 400 ).json( {
    error: "Unknow user ID. Please create an account if you don't have one "
  } );

  /**
   * We make a call to the poll service to enable the poll with @param pollId
   */
  fetch( `http://localhost:3030/poll/disable/${ userType }/${ pollId }`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ACCEPT: "application/json"
    },
  })
    .then( response => response.json() )
    .then( resp => {
      if ( !resp ) return res.status( 400 ).json( { error: "Failed update tags." } )
      res.json( resp );
    } )
    .catch( err => {
      res.json( { error: err.message } );
    } );
}



/**
 * We make a call to the poll service to enable the poll with @param pollId
 */
exports.enablePoll = ( req, res ) => {
  // We destructure @userId and @usertype from request params
  const { pollId, userId, userType } = req.params;
  const { user: { _id } } = req;

  // We check for the poll name in the request body. If not proveded, we return the error message
  if ( !pollId ) return res.status( 400 ).json( { error: "Poll ID is not provided." } );
  // We check the user type. If it's not admin, return the error message
  if ( userType !== "admin" ) return res.status( 400 ).json( { error: "Only admin is allowed for this operation" } );
  if ( userId !== _id ) return res.status( 400 ).json( {
    error: "Unknow user ID. Please create an account if you don't have one "
  } );

  /**
   * We make a call to the poll service to enable the poll with @param pollId
   */
  fetch( `http://localhost:3030/poll/enable/${ userType }/${ pollId }`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ACCEPT: "application/json"
    },
  } )
    .then( response => response.json() )
    .then( resp => {
      if ( !resp ) return res.status( 400 ).json( { error: "Failed update tags." } )
      res.json( resp );
    } )
    .catch( err => {
      res.json( { error: err.message } );
    } );
}

/**
 * We make a call to the poll service to upload image for the poll with @param pollId
 */
exports.uploadPhoto = ( req, res ) => {
  // We destructure @userId and @usertype from request params
  const { pollId, userId, userType } = req.params;
  const { user: { _id } } = req;

  const photo = req.body;

  // We check for the poll name in the request body. If not proveded, we return the error message
  if ( !pollId ) return res.status( 400 ).json( { error: "Poll ID is not provided." } );
  // We check the user type. If it's not admin, return the error message
  if ( userType !== "admin" ) return res.status( 400 ).json( { error: "Only admin is allowed for this operation" } );
  if ( userId !== _id ) return res.status( 400 ).json( {
    error: "Unknow user ID. Please create an account if you don't have one "
  } );

  /**
   * We make a call to the poll service to vote the poll with @param pollId
   */
  fetch( `http://localhost:3030/poll/upload/${userType}/${pollId}`, {
    method: "PUT",
    body: photo
  } )
    .then( response => response.json() )
    .then( resp => {
      if ( !resp ) return res.status( 400 ).json( { error: "Failed update tags." } )
      res.json( resp );
    } )
    .catch( err => {
      res.json( { error: err.message } );
    } );
}

/**
 * We make a call to the poll service to the poll with @param pollId
 */
exports.deletePoll = ( req, res ) => {
  // We destructure @userId and @usertype from request params
  const { pollId, userId, userType } = req.params;
  const { user: { _id } } = req;

  // We check for the poll name in the request body. If not proveded, we return the error message
  if ( !pollId ) return res.status( 400 ).json( { error: "Poll ID is not provided." } );
  // We check the user type. If it's not admin, return the error message
  if ( userType !== "admin" ) return res.status( 400 ).json( { error: "Only admin is allowed for this operation" } );
  if ( userId !== _id ) return res.status( 400 ).json( {
    error: "Unknow user ID. Please create an account if you don't have one "
  } );

  /**
   * We make a call to the poll service to delete the poll with @param pollId
   */
  axios.delete( `http://localhost:3030/poll/delete/${ pollId }`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ACCEPT: "application/json"
    },
  } )
    .then( response => response.json() )
    .then( resp => {
      if ( !resp ) return res.status( 400 ).json( { error: "Failed to delete poll." } )
      res.json( resp );
    } )
    .catch( err => {
      res.json( { error: err.message } );
    } );
}

