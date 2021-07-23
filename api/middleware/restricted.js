
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../secrets');

async function verifyAsync(token) {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err)
      resolve(null);
      else
      resolve(decodedToken);
    })
  })
}

/** @type {express.RequestHandler} */
const restricted = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return next([401, "token required"]);
  }

  const decodedToken = await verifyAsync(token);

  if (decodedToken) {
    req.token = decodedToken;
    return next();
  }
  else {
    return next([401, "token invalid"]);
  }
}

module.exports = restricted;
