const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(403).json("Access denied. No token provided");
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET_DEAL);
    req.user = decode;
    next();
  } catch(err) {
    res.status(401).json("Invalid token");
  }
}