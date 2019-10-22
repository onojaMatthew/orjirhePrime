const express = require("express");
const {
  createPoll,
  votePoll,
  likePoll,
  deletePoll,
  fetchAllPoll,
  uploadPhoto,
  tags,
  disablePoll,
  enablePoll,
  uploadUpdate,
  photo,
  postComment,
} = require( "../controller" );
const upload = require( "../middleware/fileupload" );

const router = express.Router();

router.get( "/all", fetchAllPoll );
router.put( "/create/:userId/:userType/:pollId", createPoll );
router.put( "/like/:userType/:pollId/:userId/", likePoll );
router.put( "/tags/:userType/:pollId", tags );
router.put( "/disable/:userType/:pollId", disablePoll );
router.get("/photo/:pollId", photo)
router.put( "/enable/:userType/:pollId", enablePoll );
router.put( "/comment/:pollId/:userType/:userId", postComment );
router.put( "/vote/:userType/:pollId/:userId", votePoll );
router.post( "/upload/:userType", upload.single( "photo" ), uploadPhoto );
router.put( "/upload/update/:userType/:pollId", upload.single( "photo" ), uploadUpdate );
router.delete("/delete/:pollId", deletePoll );

module.exports = router;
