const jwt = require("jsonwebtoken");
const {createCustomError} = require("../utils/customError");


const verifyUser = (req, res, next) => {
  const accessToken = req.cookies.access_token;
  !accessToken && next(createCustomError("You are not authenticated", 401));

  // check if token is valid
  jwt.verify(accessToken, process.env.JWTKEY, (err, user) => {
    if(err) return next(createCustomError("Token is invalid", 404));
    req.user = user;
  })

  next();
}

const verifyAdmin = (req, res, next) => {
  const accessToken = req.cookies.access_token;
  !accessToken && next(createCustomError("You are not authenticated", 401));

  // check if token is valid
  jwt.verify(accessToken, process.env.JWTKEY, (err, user) => {
    if(err) return next(createCustomError("Token is invalid", 404));
    req.user = user;
  })
  if(req.user.isAdmin) {
    next();
  } else {
    next(createCustomError("You are not authorized", 403))
  }
}


module.exports = {verifyUser, verifyAdmin};