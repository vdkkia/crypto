const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: `${process.env.KAFKA_CLIENT_ID}-${process.env.HOSTNAME}`,
  brokers: [process.env.KAFKA_BROKER_HOST],
});

const consumer = kafka.consumer({ groupId: "normalizers" });

module.exports = {
  consumer,
  kafka,
};
