const mongoose = require("mongoose");
const logger = require("../services/logger");

const init = () =>
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

mongoose.connection.on("error", (err) => {
  logger.error(`MongoDB error: ${err.message}`);
});
mongoose.connection.once("open", () => {
  logger.info("mongodb connection established...");
});

module.exports = { init, connection: mongoose.connection };
