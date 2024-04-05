const jwt = require("jsonwebtoken");

exports.checkAuthDasboard = (req, res, next) => {
  const storedKey = process.env.DASHBOARD_SECRET;
  const API_KEY = req.header("Authorization");

  if (API_KEY !== storedKey) {
    return res.status(401).send({
      authentication: false,
      message: "Not authorized User",
    });
  }

  next();
};

exports.checkUserAuth = (req, res, next) => {
  let token = req.header("X-Access-Token");
  const secret = process.env.SECRET;

  if (!token) {
    return res.status(401).send({
      authentication: false,
      message: "No token provided!",
    });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      console.error(`error in verifying ${err.toString()}`);
      return res.status(401).send({
        authentication: false,
        message: err.toString(),
      });
    }

    if (!decoded) {
      return res.status(401).send({
        authentication: false,
        message: "Unauthorized!",
      });
    }

    req.userDecodeId = decoded.id;
    req.token = token;
    next();
  });
};
