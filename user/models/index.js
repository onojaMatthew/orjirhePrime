const mongoose = require( "mongoose" );
const jwt = require( "jsonwebtoken" );
require( "dotenv" ).config();

// Destructuring Schema from mongoose object
const { Schema } = mongoose;

// Defining the user schema
const userSchema = new Schema( {
  firstName: { type: String },
  lastName: { type: String },
  email: {
    type: String,
    required: [ true, "Email is required" ],
    unique: true,
  },
  password: {
    type: String,
    required: [ true, "Password is required" ],
  },
  userType: {
    type: String,
    enum: [ "admin", "tenant", "user" ],
    default: "user",
  },
  role: {
    type: String,
    enum: [ "admin", "user" ],
    default: "user"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
} );

userSchema.methods.generateToken = function () {
  const token = jwt.sign( {
    _id: this._id,
    email: this.email,
    userType: this.userType,
    role: this.role
  }, process.env.JWT_SECRET_DEAL ) 
  return token;
}

const User = mongoose.model( "User", userSchema );
exports.User = User;
