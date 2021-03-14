const handlePostDataRequest = require("../../services/data/controllers/handle-post-data-request");

module.exports = (server) => {
  server.post("/api/data", handlePostDataRequest);
};
