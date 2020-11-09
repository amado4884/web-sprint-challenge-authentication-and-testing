const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).send("You shall not pass!");
  try {
    const decoded = jwt.verify(
      authorization.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    if (!decoded || !decoded.id || !decoded.username)
      return res.status(401).send("Na duude");
    req.user = {
      id: decoded.id,
      username: decoded.username,
    };
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).send("Invalid signature");
  }
};
