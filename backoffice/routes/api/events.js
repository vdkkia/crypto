const handlePostEventRequest = require("../../services/events/controllers/handle-post-event-request");

module.exports = (server) => {
  server.post("/api/events", handlePostEventRequest);
};
