const mongoose = require("mongoose");

const timelineSchema = new mongoose.Schema(
  {
    keywords: [{ type: String }],
    trends: { type: mongoose.Mixed },
    reportTimestamp: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Timeline = mongoose.model("Timeline", timelineSchema);
module.exports = Timeline;
