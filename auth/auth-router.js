const router = require("express").Router();
const bcrpyt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../users/users-model");

const validateNewUser = async (req, res, next) => {
  if (!req.body)
    return res.status(400).json({ message: "Invalid new user data" });

  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Missing new user data" });
  req.newUser = { username, password };
  next();
};

const generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
  };

  const options = {
    expiresIn: "1w",
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

router.post("/register", validateNewUser, async (req, res) => {
  const { newUser } = req;
  const rounds = process.env.SALT_ROUNDS || 10;
  try {
    newUser.password = await bcrpyt.hash(newUser.password, Number(rounds));

    const user = await Users.add(newUser);
    if (!user)
      res.status(500).json({ message: "There was an error registering" });
    res
      .status(200)
      .json({ message: "You have registered, you can now log in." });
  } catch (err) {
    if (err.message.includes("UNIQUE constraint"))
      return res.status(500).json({ message: "That user already exists" });
    return res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  if (!req.body)
    return res.status(400).json({ message: "Missing login information" });

  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({
      message: "Please provide a username and password to log in",
    });

  try {
    const user = await Users.findByUsername(username);
    if (!user || !(await bcrpyt.compare(password, user.password)))
      return res.status(400).json({
        message: "Invalid credentials",
      });
    const token = generateToken(user);
    return res.status(200).json({ message: "success", token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Could not log in" });
  }
});

module.exports = router;
