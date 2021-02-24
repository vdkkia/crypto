const logger = require("../core/logger");

const auth = (req, res, next) => {
  if (req.isAuthenticated()) {
    logger.info("The user is authenticated");
    next();
  } else {
    logger.error("The user is not authenticated");
    return res.status(401).json({ error: "User is not logged in." });
  }

  // req.user = {
  //   plan: "monthly",
  //   role: "admin",
  //   _id: "5fea261a0b06af0df059e589",
  //   username: "vahidkiani88@gmail.com",
  //   name: "وحید",
  //   email: "vahidkiani88@gmail.com",
  //   maxSessions: 2,
  //   googleId: "113369185982919471890",
  //   picUrl: "https://lh3.googleusercontent.com/a-/AOh14Gjta61zKlfbrDmzXLR2qyMTrtNO9_yT9lLTFluMkw=s96-c",
  // };

  // next();
};
module.exports = auth;
