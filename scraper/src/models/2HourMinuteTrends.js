const mongoose = require("mongoose");
const minuteTrends_2HourSchema = new mongoose.Schema(
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

minuteTrends_2HourSchema.index({ keyword: 1, timeSpan: 1 });


const minuteTrends_2Hour = mongoose.model("minuteTrends_2Hour", minuteTrends_2HourSchema);
module.exports = minuteTrends_2Hour;
