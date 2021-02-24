const passport = require("passport");
const LocalStrategy = require("passport-local");
const Users = require("../models/user");

passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

module.exports = passport.use(new LocalStrategy(Users.authenticate()));
