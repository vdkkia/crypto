const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/register", (req, res, next) => {
  const { username, password } = req.body;
  User.register(new User({ username }), password, (err, user) => {
    console.log(req.body);
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    return res.status(200).json({ message: "Registration was successful!" });
  });
});

module.exports = router;
