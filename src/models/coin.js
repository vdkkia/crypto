const mongoose = require("mongoose");
const coinSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    id: { type: String, required: true, unique: true },
    symbol: { type: String, required: true, unique: true },
    websiteUrl: { type: String },
    redditUrl: { type: String },
    twitterUrl: { type: String },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("coin", coinSchema);
