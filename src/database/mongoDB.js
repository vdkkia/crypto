const mongoose = require("mongoose");

const connect = async (logger) => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    logger.info("mongoDB connection successful");
  } catch (e) {
    logger.error("Database connection error: " + e);
  }
};

module.exports = { connect };
