const mongoose = require("mongoose");

const groupedTrendSchema = new mongoose.Schema(
  {
    keyword: { type: String, required: true, unique: true },
    data: [{ type: String }],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("groupedTrend", groupedTrendSchema);
