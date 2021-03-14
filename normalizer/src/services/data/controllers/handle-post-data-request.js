const normalizeIncomingData = require("../../normalizaton/normalize-incoming-data");
const { withErrorHandling } = require("./../../errors");

const handlePostDataRequest = async (req, res, next) => {
  normalizeIncomingData(req.body);
  res.send({ ok: true });
  next();
};

module.exports = withErrorHandling(handlePostDataRequest);
