const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    keyword: { type: String, required: true },
    category: { type: String },
    trend: { type: mongoose.Mixed },
    reportTimestamp: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Alert = mongoose.model("Alert", alertSchema);
module.exports = Alert;
