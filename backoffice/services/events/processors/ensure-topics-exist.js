const { admin } = require("./../../../adapters/kafka");
const topics = require("./topics");

const ensureTopicsExist = async () => {
  console.log("ensuring that kafka topics exist");
  await admin.connect();
  const availableTopics = await admin.listTopics();
  const topicsToBuild = topics.filter(
    (topic) => availableTopics.indexOf(topic) === -1
  );
  if (topicsToBuild.length > 0) {
    return admin.createTopics({
      topics: topicsToBuild.map((topic) => ({
        topic,
        numPartitions: 3,
        replicationFactor: 1,
      })),
    });
  }
  return [];
};

module.exports = ensureTopicsExist;
