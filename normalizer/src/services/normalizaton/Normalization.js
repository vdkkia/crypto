const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const normalizationSchema = new mongoose.Schema(
  {
    batchInfo: { type: mongoose.Mixed },
    batchIndex: { type: Number },
    timelineData: { type: mongoose.Mixed },
    averages: { type: mongoose.Mixed },
    newRecords: { type: mongoose.Mixed },
    newHistoryMaps: { type: mongoose.Mixed },
  },
  {
    timestamps: true,
  }
);

normalizationSchema.plugin(AutoIncrement, { inc_field: "id" });

const Normalization = mongoose.model("Normalization", normalizationSchema);
module.exports = Normalization;
