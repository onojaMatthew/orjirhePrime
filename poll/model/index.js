const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;

const pollSchema = new Schema({
  
  name: {
    type: String,
  },
  votes: [ { type: ObjectId, ref: "User" } ],
  likes: [ { type: ObjectId, ref: "User" }],
  tags: [ {
    type: String,
    enum: [ "education", "fashion", "music", "sport", "style" ],
    default: "education"
  } ],
  photo: { data: Buffer, ContentType: String },
  disabled: { type: Boolean, default: false },
  comment: [ {
    comment: String,
    firstName: String,
    lastName: String,
    createdBy: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Poll = mongoose.model("Poll", pollSchema);

exports.Poll = Poll;
