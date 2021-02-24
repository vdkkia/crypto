const session = require("express-session");
const Redis = require("../database/redis");
const RedisStore = require("connect-redis")(session);
const Session = session({
  store: new RedisStore({ client: Redis.redisClient }),
  secret: process.env.sessionSecret,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 3600000 * 8 },
  unset: "destroy",
});

module.exports = Session;
