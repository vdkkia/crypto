const { BadRequestError } = require("restify-errors");
const { withErrorHandling } = require("../../errors");
const { raiseEvent } = require("../processors");

const handlePostEventRequest = async (req, res, next) => {
  const {
    body: { topic, payload },
  } = req;
  if (!topic || !payload) throw new BadRequestError("Not enough data");
  const result = await raiseEvent({ topic, payload });
  res.send({ done: true, result });
  next();
};

module.exports = withErrorHandling(handlePostEventRequest);
