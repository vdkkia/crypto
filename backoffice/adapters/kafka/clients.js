const { Kafka } = require("kafkajs");
const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: [process.env.KAFKA_BROKER_HOST],
});

module.exports = {
  admin: kafka.admin(),
  producer: kafka.producer(),
  consumer: kafka.consumer({ groupId: "backoffice" }),
};
