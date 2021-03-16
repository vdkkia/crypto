const pgPromise = require("pg-promise");
const logger = require("./../services/logger");

const pgp = pgPromise({
  error(err, e) {
    if (e.cn) {
      // this is a connection-related error
      // cn = safe connection details passed into the library:
      //      if password is present, it is masked by #
      logger.error("[db connection error:]" + err.message);
    }

    if (e.query) {
      // query string is available
      logger.error("[db query error:]" + err.message);
      if (e.params) {
        // query parameters are available
      }
    }

    if (e.ctx) {
      // occurred inside a task or transaction
      logger.error("[db task error:]" + err.message);
    }
  },
  capSQL: true,
});

const db = pgp(process.env.POSTGRES_URI);

module.exports = { db, pgp };
