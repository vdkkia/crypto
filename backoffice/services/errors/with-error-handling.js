const withErrorHandling = (reqHandler) => async (req, res, next) => {
  try {
    await reqHandler(req, res, next);
  } catch (err) {
    next(err);
  }
};

module.exports = withErrorHandling;
