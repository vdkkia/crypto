const mongoose = require("mongoose");

const trendItemSchema = new mongoose.Schema(
  {
    value: { type: Number },
    timeStamp: { type: String },
  },
  { _id: false }
);
const weeklyTrendsSchema = new mongoose.Schema(
  {
    keyword: { type: String, required: true },
    data: [trendItemSchema],
  },
  {
    timestamps: true,
  }
);

const Alert = mongoose.model("weeklyTrend", weeklyTrendsSchema);
module.exports = Alert;
