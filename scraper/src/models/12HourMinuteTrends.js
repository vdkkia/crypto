const mongoose = require("mongoose");

const minuteTrends_12HourSchema = new mongoose.Schema(
  {
    keyword: String,
    reference: String,
    timelineData: { type: mongoose.Mixed },
    averages: { type: mongoose.Mixed },
    timeSpan: String,
  },
  {
    timestamps: true,
  }
);

minuteTrends_12HourSchema.index({ keyword: 1, timeSpan: 1 });


const minuteTrends_12Hour = mongoose.model("minuteTrends_12Hour", minuteTrends_12HourSchema);
module.exports = minuteTrends_12Hour;
