const mongoose = require("mongoose");
const db = process.env.mongoDatabase;
const connect = async (logger) => {
  try {
    await mongoose.connect(`mongodb://${process.env.mongoServer}/${db}?authSource=coin`, {
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
