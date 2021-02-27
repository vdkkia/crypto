const mongoose = require("mongoose");
const logger = require("../core/logger");
const db = process.env.NODE_ENV == "test" ? process.env.mongoTestDatabase : process.env.mongoDatabase;
const connect = async () => {
  try {
    await mongoose.connect(`mongodb://${process.env.mongoServer}/${db}?authSource=admin`, {
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
