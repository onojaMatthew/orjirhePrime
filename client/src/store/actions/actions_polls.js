import { userType, isAuthenticated } from "../../helpers/authenticate";
/**
 * Create action type
 */
export const CREATE_POLL_START = "CREATE_POLL_START";
export const CREATE_POLL_SUCCESS = "CREATE_POLL_SUCCESS";
export const CREATE_POLL_FAILED = "CREATE_POLL_FAILED";

/**
 * Get action type
 */
export const GET_POLL_START = "GET_POLL_START";
export const GET_POLL_SUCCESS = "GET_POLL_SUCCESS";
export const GET_POLL_FAILED = "GET_POLL_FAILED";

/**
 * tag action type
 */
export const TAG_POLL_START = "TAG_POLL_START";
export const TAG_POLL_SUCCESS = "TAG_POLL_SUCCESS";
export const TAG_POLL_FAILED = "TAG_POLL_FAILED";

/**
 * Like action type
 */
export const LIKE_POLL_START = "LIKE_POLL_START";
export const LIKE_POLL_SUCCESS = "LIKE_POLL_SUCCESS";
export const LIKE_POLL_FAILED = "LIKE_POLL_FAILED";

/**
 * Vote action type
 */
export const VOTE_POLL_START = "VOTE_POLL_START";
export const VOTE_POLL_SUCCESS = "VOTE_POLL_SUCCESS";
export const VOTE_POLL_FAILED = "VOTE_POLL_FAILED";

/**
 * Disable ation type
 */
export const DISABLE_POLL_START = "DISABLE_POLL_START";
export const DISABLE_POLL_SUCCESS = "DISABLE_POLL_SUCCESS";
export const DISABLE_POLL_FAILED = "DISABLE_POLL_FAILED";

/**
 * Enable acion pe
 */

export const ENABLE_POLL_START = "ENABLE_POLL_START";
export const ENABLE_POLL_SUCCESS = "ENABLE_POLL_SUCCESS";
export const ENABLE_POLL_FAILED = "ENABLE_POLL_FAILED";

/**
 * Upload action type
 */
export const UPLOAD_POLL_PHOTO_START = "UPLOAD_POLL_PHOTO_START";
export const UPLOAD_POLL_PHOTO_SUCCESS = "UPLOAD_POLL_PHOTO_SUCCESS";
export const UPLOAD_POLL_PHOTO_FAILED = "UPLOAD_POLL_PHOTO_FAILED";

/**
 * update upload action type
 */
export const UPDATE_UPLOAD_POLL_PHOTO_START = "UPDATE_UPLOAD_POLL_PHOTO_START";
export const UPDATE_UPLOAD_POLL_PHOTO_SUCCESS = "UPDATE_UPLOAD_POLL_PHOTO_SUCCESS";
export const UPDATE_UPLOAD_POLL_PHOTO_FAILED = "UPDATE_UPLOAD_POLL_PHOTO_FAILED";

/**
 * Delete action type
 */
export const DELETE_POLL_START = "DELETE_POLL_START";
export const DELETE_POLL_SUCCESS = "DELETE_POLL_SUCCESS";
export const DELETE_POLL_FAILED = "DELETE_POLL_FAILED";

export const POST_COMMENT_START = "POST_COMMENT_START"
export const POST_COMMENT_SUCCESS = "POST_COMMENT_SUCCESS"
export const POST_COMMENT_FAILED = "POST_COMMENT_FAILED"


const BASE_URL = "http://localhost:3020/user";
const MAIN_BASE_URL = "http://localhost:3030/poll";

export const createPollStart = () => {
  return {
    type: CREATE_POLL_START
  }
}

export const createPollSuccess = ( data ) => {
  return {
    type: CREATE_POLL_SUCCESS,
    data
  }
}

export const createPollFailed = ( error ) => {
  return {
    type: CREATE_POLL_FAILED,
    error
  }
}


export const createPoll = ( data, userId, pollId ) => {
  return dispatch => {
    dispatch( createPollStart() );
    fetch( `${ BASE_URL }/create/${ userType() }/${ pollId}/${ userId }`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ACCEPT: "application/json",
        "x-auth-token": isAuthenticated().token
      },
      body: JSON.stringify( data )
    } )
      .then( response => response.json() )
      .then( data => {
        dispatch( createPollSuccess( data ) );
        dispatch( getPoll() );
      } )
      .catch( err => {
        dispatch( createPollFailed( err.message ) );
      } );
  }
}
// tTy

export const getPollStart = () => {
  return {
    type: GET_POLL_START
  }
}

export const getPollSuccess = (data) => {
  return {
    type: GET_POLL_SUCCESS,
    data
  }
}

export const getPollFailed = (error) => {
  return {
    type: GET_POLL_FAILED,
    error
  }
}

export const getPoll = () => {
  return dispatch => {
    dispatch(getPollStart())
    fetch( `${ MAIN_BASE_URL }/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ACCEPT: "application/json"
      }
    } )
      .then( response => response.json() )
      .then( resp => {
        dispatch( getPollSuccess( resp ) );
      } )
      .catch( err => {
        dispatch( getPollFailed( err.message ) );
      });
  }
}


export const tagPollStart = () => {
  return {
    type: TAG_POLL_START
  }
}

export const tagPollSuccess = (data) => {
  return {
    type: TAG_POLL_SUCCESS,
    data
  }
}

export const tagPollFailed = ( error ) => {
  return {
    type: TAG_POLL_FAILED,
    error
  }
}

export const tagPoll = (data, userId, pollId) => {
  return dispatch => {
    dispatch( tagPollStart() );
    fetch( `${ BASE_URL }/tags/${ userType() }/${ pollId }/${userId}`, {
      method: "PUT",
      headers: {
        ACCEPT: "application/json",
        "Content-Type": "application/json",
        "x-auth-token": isAuthenticated().token
      },
      body: JSON.stringify(data)
    } )
      .then( response => response.json() )
      .then( resp => {
        dispatch( tagPollSuccess( resp ) );
        dispatch( getPoll() );
      } )
      .catch( err => {
        dispatch( tagPollFailed( err.message ))
      });
  }
}


export const likePollStart = () => {
  return {
    type: LIKE_POLL_START
  }
}

export const likePollSuccess = ( data ) => {
  return {
    type: LIKE_POLL_SUCCESS,
    data
  }
}

export const likePollFailed = ( error ) => {
  return {
    type: LIKE_POLL_FAILED,
    error
  }
}

export const likePoll = ( pollId ) => {
  const userId = isAuthenticated().user._id;
    return dispatch => {
      dispatch( likePollStart() );
      fetch( `${ BASE_URL }/like/${ userType() }/${ pollId }/${userId}`, {
        method: "PUT",
        headers: {
          ACCEPT: "application/json",
          "Content-Type": "application/json",
          "x-auth-token": isAuthenticated().token
        }
      } )
        .then( response => response.json() )
        .then( resp => {
          if ( resp.error ) {
            dispatch( likePollFailed( resp.error ) );
          }
          dispatch( likePollSuccess( resp ) );
          dispatch( getPoll() );
        } )
        .catch( err => {
          dispatch( likePollFailed( err.message ) );
    });
  }
}


export const postCommentStart = () => {
  return {
    type: POST_COMMENT_START
  }
}

export const postCommentSuccess = (data) => {
  return {
    type: POST_COMMENT_SUCCESS,
    data
  }
}

export const postCommentFailed = (error) => {
  return {
    type: POST_COMMENT_FAILED,
    error
  }
}

export const postComment = ( data, pollId ) => {
  const userId = isAuthenticated().user._id;
  return dispatch => {
    dispatch( postCommentStart() )
    fetch( `${ MAIN_BASE_URL }/comment/${ pollId }/${ userType() }/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ACCEPT: "application/json",
        "x-auth-token": isAuthenticated().token
      },
      body: JSON.stringify( data )
    } )
      .then( response => response.json() )
      .then( resp => {
        if ( resp.error ) {
          dispatch( postCommentFailed( resp.error ) );
        }
        dispatch( postCommentSuccess( resp ) )
        dispatch( getPoll() );
      } )
      .catch( err => {
        dispatch( postCommentFailed( err.message ) );
      } );
  }
  
}

export const votePollStart = () => {
  return {
    type: VOTE_POLL_START
  }
}

export const votePollSuccess = ( data ) => {
  return {
    type: VOTE_POLL_SUCCESS,
    data
  }
}

export const votePollFailed = ( error ) => {
  return {
    type: VOTE_POLL_FAILED,
    error
  }
}

export const votePoll = ( pollId ) => {
  const userId = isAuthenticated().user._id;
    return dispatch => {
      dispatch( votePollStart() );
      fetch( `${ BASE_URL }/vote/${ userType() }/${ pollId }/${ userId }`, {
        method: "PUT",
        headers: {
          ACCEPT: "application/json",
          "Content-Type": "application/json",
          "x-auth-token": isAuthenticated().token
        }
      } )
        .then( response => response.json() )
        .then( resp => {
          if ( resp.error ) {
            dispatch( votePollFailed( resp.error ) );
          }
          dispatch( votePollSuccess( resp ) );
          dispatch( getPoll() );
        } )
        .catch( err => {
          dispatch( votePollFailed( err.message ) );
    });
  }
}


export const disablePollStart = () => {
  return {
    type: DISABLE_POLL_START
  }
}

export const disablePollSuccess = ( data ) => {
  return {
    type: DISABLE_POLL_SUCCESS,
    data
  }
}

export const disablePollFailed = ( error ) => {
  return {
    type: DISABLE_POLL_FAILED,
    error
  }
}

export const disablePoll = ( pollId ) => {
  const userId = isAuthenticated().user._id;
  return dispatch => {
    dispatch( disablePollStart() );
    fetch( `${ BASE_URL }/disable/${ userType() }/${ pollId }/${ userId }`, {
      method: "PUT",
      headers: {
        ACCEPT: "application/json",
        "Content-Type": "application/json",
        "x-auth-token": isAuthenticated().token
      }
    } )
      .then( response => response.json() )
      .then( resp => {
        dispatch( disablePollSuccess( resp ) );
        dispatch( getPoll() );
      } )
      .catch( err => {
        dispatch( disablePollFailed( err.message ) );
      });
  }
}


export const enablePollStart = () => {
  return {
    type: ENABLE_POLL_START
  }
}

export const enablePollSuccess = ( data ) => {
  return {
    type: ENABLE_POLL_SUCCESS,
    data
  }
}

export const enablePollFailed = ( error ) => {
  return {
    type: ENABLE_POLL_FAILED,
    error
  }
}

export const enablePoll = ( pollId ) => {
  const userId = isAuthenticated().user._id;
  return dispatch => {
    dispatch( enablePollStart() );
    fetch( `${ BASE_URL }/enable/${ userType() }/${ pollId }/${ userId }`, {
      method: "PUT",
      headers: {
        ACCEPT: "application/json",
        "Content-Type": "application/json",
        "x-auth-token": isAuthenticated().token
      }
    } )
      .then( response => response.json() )
      .then( resp => {
        dispatch( enablePollSuccess( resp ) );
        dispatch( getPoll() );
      } )
      .catch( err => {
        dispatch( enablePollFailed( err.message ) );
      } );
  }
}



export const deletePollStart = () => {
  return {
    type: DELETE_POLL_START
  }
}

export const deletePollSuccess = ( data ) => {
  return {
    type: DELETE_POLL_SUCCESS,
    data
  }
}

export const deletePollFailed = ( error ) => {
  return {
    type: DELETE_POLL_FAILED,
    error
  }
}

export const deletePoll = ( pollId ) => {
  return dispatch => {
    dispatch( deletePollStart() );
    fetch( `${ MAIN_BASE_URL }/delete/${ pollId }`, {
      method: "DELETE",
      headers: {
        ACCEPT: "application/json",
        "Content-Type": "application/json",
        "x-auth-token": isAuthenticated().token
      }
    } )
      .then( response => response.json() )
      .then( resp => {
        dispatch( deletePollSuccess( resp ) );
      } )
      .catch( err => {
        dispatch( deletePollFailed( err.message ) );
      });
  }
}



export const uploadPollStart = () => {
  return {
    type: UPLOAD_POLL_PHOTO_START
  }
}

export const uploadPollSuccess = ( data ) => {
  return {
    type: UPLOAD_POLL_PHOTO_SUCCESS,
    data
  }
}

export const uploadPollFailed = ( error ) => {
  return {
    type: UPLOAD_POLL_PHOTO_FAILED,
    error
  }
}

export const uploadPoll = ( data ) => {
  return dispatch => {
    dispatch( uploadPollStart() );
    fetch( `${ MAIN_BASE_URL }/upload/${ userType() }`, {
      method: "POST",
      body: data
    } )
      .then( response => response.json() )
      .then( resp => {
        dispatch( uploadPollSuccess( resp ) );
      } )
      .catch( err => {
        dispatch( uploadPollFailed( err.message ) );
      });
  }
}

export const uploadUpdateStart = () => {
  return {
    type: UPDATE_UPLOAD_POLL_PHOTO_START
  }
}

export const uploadUpdateSuccess = ( data ) => {
  return {
    type: UPDATE_UPLOAD_POLL_PHOTO_SUCCESS,
    data
  }
}

export const uploadUpdateFailed = ( error ) => {
  return {
    type: UPDATE_UPLOAD_POLL_PHOTO_FAILED,
    error
  }
}

export const uploadUpdate = ( data, userId, pollId ) => {
  return dispatch => {
    dispatch( uploadUpdateStart() );
    fetch( `${ MAIN_BASE_URL }/upload/update/${ userType() }/${pollId}`, {
      method: "PUT",
      body: data
    } )
      .then( response => response.json() )
      .then( resp => {
        dispatch( uploadUpdateSuccess( resp ) );
      } )
      .catch( err => {
        dispatch( uploadUpdateFailed( err.message ) );
      } );
  }
}
