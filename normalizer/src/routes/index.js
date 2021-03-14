const { plugins } = require("restify");

module.exports = (server) => {
  server.use(plugins.bodyParser({ mapParams: true }));
  require("./api")(server);
};
