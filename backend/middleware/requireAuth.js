const User = require("../models/userModel");
const jwk = require("jsonwebtoken");

const requireAuth = async (req, res, next) => {
  // Get the authorization token
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  // Get the second part of the token string
  const token = authorization.split(" ")[1];

  try {
    //  Verify the token from the headers with secret token
    const { _id } = jwk.verify(token, process.env.SECRET);

    // Find the user by the id from the token and send it
    req.user = await User.findOne({ _id });
    next();
  } catch (error) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired", expiredAt: error.expiredAt });
    } else {
      return res.status(400).json({ message: "Invalid token" });
    }
  }
};
module.exports = requireAuth;
