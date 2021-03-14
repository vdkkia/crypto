const fs = require("fs");
const { consumer } = require("./src/adapters/kafka");
const redis = require("./src/adapters/redis");
const logger = require("./src/services/logger");
const normalizeIncomingData = require("./src/services/normalizaton/normalize-incoming-data");
// const sampleInputData = fs.readFileSync("./data/sample-data.txt", "utf8");
// const sampleNormalizedData = require("./data/sample-normalized-data.json");
// const saveRecord = require("./src/services/records/save-record");

(async () => {
  try {
    await redis.init();
    // await saveRecord(sampleNormalizedData);
    // await normalizeIncomingData(sampleInputData);
    // await consumer.connect();
    await consumer.subscribe({
      topic: "new-google-trends-plain-data",
      fromBeginning: true,
    });
    logger.info("consumer subscribed to topic");
    await consumer.run({
      eachMessage: ({ topic, partition, message }) => {
        normalizeIncomingData(message.value.toString());
      },
    });
  } catch (err) {
    logger.error(err.message);
  }
})();
