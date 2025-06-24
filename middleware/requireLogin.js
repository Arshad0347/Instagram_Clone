const { SECRETKEY } = require("../keys");
const jwt = require("jsonwebtoken");
const User = require("../models/auth");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      errorMessage: "Please login first one!!",
    });
  }

  const token = authorization.replace("Bearer ", "");
  console.log(token);
  jwt.verify(token, SECRETKEY, (err, payload) => {
    if (err) {
      return res.status(401).json({
        errorMessage: "Please login first two!!",
      });
    }

    const { id } = payload;
    // console.log(id);

    User.findById(id).then((savedUser) => {
      // console.log("middleware: ", savedUser);

      req.user = savedUser;
      next();
    });
  });
};
