const { Poll } = require( "../model" );
const fs = require( "fs" );

// We create 
exports.createPoll = ( req, res ) => {
  // We destructure @userId and @usertype from request params
  const { userId, userType, pollId } = req.params;
  // We destructure @name from request body
  const { name } = req.body;
  // We check for the poll name in the request body. If not proveded, we return the error message
  if ( !name ) return res.status( 400 ).json( { error: "Name is not provided. A poll must have a name" } );
  // We check the user type. If it's not admin, return the error message
  if ( userType !== "admin" ) return res.status( 400 ).json( { error: "Only an admin allowed for this operation" });
  if ( !pollId ) return res.status( 400 ).json( { error: "Poll ID is not provided." } );
  // We create a new poll here with name provided
  Poll.findByIdAndUpdate( { _id: pollId } )
    .then( poll => {
      if ( !poll ) return res.status( 400 ).json( { error: "Poll not found" } );
      poll.name = name;
      return poll.save( ( err, data ) => {
        if ( err || !data ) return res.status( 400 ).json( { error: err.message } );
        res.json( data );
      });
    } )
    .catch( err => {
      res.json( { error: err.message } );
    } );
}

// Add new tags to the poll with provided ID @pollId
exports.tags = ( req, res ) => {
  const newObj = req.body;
  console.log(req.body)
  const { userType, pollId } = req.params;
  // We check for user type. If it is not admin return the error message
  if ( userType !== "admin" ) return res.status( 403 ).json( {
    error: "Only admin is allowed access to this operation"
  } );
  if ( !pollId ) return res.status( 400 ).json( {
    error: "Poll ID is not provided. Please ensure you are authorized for this operation"
  } );

  Poll.findByIdAndUpdate( pollId, { $push: { tags: newObj } }, { new: true } )
    .then( poll => {
      if ( !poll ) return res.status( 400 ).json( {
        error: "Could not add new tags. Please try again later"
      } );
      res.json( poll );
    } )
    .catch( err => {
      res.json( { error: err.message } );
    } );
}

/**
 * post comment 
 */
exports.postComment = ( req, res ) => {
  const { comment, firstName, lastName } = req.body;
  const { pollId, userType, userId } = req.params;
  if ( !firstName || !lastName ) return res.status( 400 ).json( { error: "Please log in correctly" } );
  if ( !comment ) return res.status( 400 ).json( { error: "Comment is required"})
  if ( !pollId ) return res.status( 400 ).json( { error: "Poll ID is not provided" } );
  if ( userType !== "user" ) return res.status( 400 ).json( { error: "Only users are allowed to post comments" } );
  const newData = {
    comment,
    firstName,
    lastName,
    createdBy: userId
  }

  Poll.findByIdAndUpdate( { _id: pollId }, { $push: { comment: newData } }, { new: true } )
    .then( poll => {
      if ( !poll ) return res.status( 400 ).json( { error: "Could not update data." } );
      res.json( poll );
    } )
    .catch( err => {
      res.json( { error: err.message } );
    } );
}


/**
 * Set disabled to true for poll with the ID @params pollId
 */
exports.disablePoll = ( req, res ) => {
  const newObj = req.body.tags;
  const { userType, pollId } = req.params;

  // We check for user type. If it is not admin return the error message
  if ( userType !== "admin" ) return res.status( 403 ).json( {
    error: "Only admin is allowed access to this operation"
  } );
  if ( !pollId ) return res.status( 400 ).json( {
    error: "Poll ID is not provided. Please ensure you are authorized for this operation"
  } );

  Poll.findByIdAndUpdate( pollId, { $set: { disabled: true } }, { new: true } )
    .then( poll => {
      if ( !poll ) return res.status( 400 ).json( {
        error: "Could not add new tags. Please try again later"
      } );
      res.json( poll );
    } )
    .catch( err => {
      res.json( { error: err.message } );
    } );
}

/**
 * Set enabled to true for poll with the ID @params pollId
 */
exports.enablePoll = ( req, res ) => {
  const newObj = req.body.tags;
  const { userType, pollId } = req.params;

  // We check for user type. If it is not admin return the error message
  if ( userType !== "admin" ) return res.status( 403 ).json( {
    error: "Only admin is allowed access to this operation"
  } );
  if ( !pollId ) return res.status( 400 ).json( {
    error: "Poll ID is not provided. Please ensure you are authorized for this operation"
  } );

  Poll.findByIdAndUpdate( pollId, { $set: { disabled: false } }, { new: true } )
    .then( poll => {
      if ( !poll ) return res.status( 400 ).json( {
        error: "Could not add new tags. Please try again later"
      } );
      res.json( poll );
    } )
    .catch( err => {
      res.json( { error: err.message } );
    } );
}

// Allow users to vote for a particular poll
exports.votePoll = ( req, res ) => {
  const { userId, pollId, userType } = req.params;

  // We check whether the user type is available in the request params. If not, return the error message
  if ( userType !== "user" ) return res.status( 400 ).json( { error: "Only users can vote" } );
  // We check for the user ID in the rquest params. If not provided, return the error message
  if ( !userId ) return res.status( 400 ).json( { error: "No user Id provided. Ensure you're correctly logged in" } );
  // We check if the poll ID is in the request params. If not, return the error message
  if ( !pollId ) return res.status( 400 ).json( { error: "Poll ID is required for voting operation" } );

  Poll.findOne( { _id: pollId } )
    .then( poll => {
      if ( !poll ) return res.status( 400 ).json( {
        error: "Poll not found"
      } )

      /**
       * Get the votes from the poll and assign it to votes @votes variable
       * then check if the user id @userId is in it. If it's in it don't allow the vote to proceed
       * just return the error message
       */
      const votes = poll.votes;
      if ( votes.includes( userId ) ) return res.status( 400 ).json( {
        error: "you have voted this poll already"
      } );

      // Here we find the poll with the given pollId and update it
      Poll.findByIdAndUpdate( pollId, { $push: { votes: userId } }, { new: true } )
        .then( poll => {
          if ( !poll ) return res.status( 400 ).json( { error: "Something went wrong. Voting was not successful." } );
          res.json( poll )
        } )
        .catch( err => {
          res.json( { error: err.message } );
        } );
    } )

}

// Allows users to like a poll with the given ID
exports.likePoll = ( req, res ) => {
  const { userId, pollId, userType } = req.params;
  console.log(userId, "user id")
  // We check whether the user type is available in the request params. If not, return the error message
  if ( userType !== "user" ) return res.status( 400 ).json( { error: "Only users can like a poll" } );
  // We check for the user ID in the rquest params. If not provided, return the error message
  if ( !userId ) return res.status( 400 ).json( { error: "No user Id provided. Ensure you're correctly logged in" } );
  // We check if the poll ID is in the request params. If not, return the error message
  if ( !pollId ) return res.status( 400 ).json( { error: "Poll ID is required for voting operation" } );

  Poll.findOne( { _id: pollId } )
    .then( poll => {
      if ( !poll ) return res.status( 400 ).json( {
        error: "Poll not found"
      } )

      /**
       * Get the likes from the poll and assign it to likes @likes variable
       * then check if the user id @userId is in it. If it's in it don't allow the like 
       * operation to proceed just return the error message
       */
      const likes = poll.likes;
      if ( likes.includes( userId ) ) return res.status( 400 ).json( {
        error: "you have liked this poll already"
      } );

      // Here we find the poll with the given pollId and update it
      Poll.findByIdAndUpdate( pollId, { $push: { likes: userId } }, { new: true } )
        .then( poll => {
          if ( !poll ) return res.status( 400 ).json( { error: "Something went wrong. Voting was not successful." } );
          res.json( poll )
        } )
        .catch( err => {
          res.json( { error: err.message } );
        } );
    })
  
}

exports.photo = ( req, res, next ) => {
  const { pollId } = req.params;
  
  Poll.findById( { _id: pollId } )
    .then( poll => {
      if ( !poll ) return res.status( 400 ).json( { error: "Poll not found" } );
      res.set( "Content-Type", poll.photo.ContentType );
      return res.send( poll.photo.data );
    } )
    .catch( err => {
      res.json( { error: err.message } );
    })
}

// Upload poll photo
exports.uploadPhoto = ( req, res) => {
  const { userType } = req.params;
  if ( userType !== "admin" ) return res.status( 403 ).json( {
    error: "Unathorized access. Only admin can delete a poll"
  } );
  console.log( fs.readFileSync( req.file.path ))
  // Assigned the path to a new constant @photo
  const photo = req.file.path;
  let poll = new Poll();
  poll.photo.data = fs.readFileSync( req.file.path );
  poll.photo.contentType = "image/jpg";
  return poll.save()
    .then( poll => {
      if ( !poll ) return res.status( 400 ).json( { error: "File upload failed" } )
      res.json( poll );
    } )
    .catch( err => {
      console.log(err.message)
      res.json( { error: err.message } );
    } );
}

// Update poll photo
exports.uploadUpdate = ( req, res ) => {
  const { userType, pollId } = req.params;
  if ( userType !== "admin" ) return res.status( 403 ).json( {
    error: "Unathorized access. Only admin can delete a poll"
  } );

  if ( !pollId ) return res.status( 400 ).json( { error: "Poll ID not provided" } );

  // Assigned the path to a new constant @photo
  
  Poll.findByIdAndUpdate( { _id: pollId } )
    .then( poll => {
      if ( !poll ) return res.status( 400 ).json( { error: `Poll with the ID ${ pollId } not found` } )
      poll.photo.data = fs.readFileSync( req.file.path );
      poll.photo.contentType = "image/jpg";
      return poll.save();
    } )
    .catch( err => {
      res.json( { error: err.message } );
    })
}

// We fetch all poll here
exports.fetchAllPoll = (req, res) => {
  Poll.find( {} )
    .sort( {createdAt: -1 } )
    .then( poll => {
      if ( !poll ) return res.status( 400 ).json( { error: "No records found" } );
      res.json(poll);
    })
    .catch(err => {
      res.json({ error: err.message });
    });
}

// We delete a poll with @pollId 
exports.deletePoll = (req, res) => {
  const { pollId } = req.params;
  // if ( userType !== "admin" ) return res.status( 403 ).json( { error: "Unathorized access. Only admin can delete a poll" } );
  if (!pollId) return res.status(400).json({ error: "The id of the discussion to be deleted is required" });
  Poll.findByIdAndRemove(pollId)
    .then(poll => {
      res.json({ success: "Poll successfully deleted"})
    })
    .catch(err => {
      res.json({ error: err.message });
    });
}

