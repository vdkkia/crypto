const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: [process.env.KAFKA_BROKER_HOST],
});

const producer = kafka.producer();

const raiseEvent = async ({ topic, payload }) => {
  await producer.connect();
  await producer.send({
    topic,
    messages: [{ value: payload }],
  });
  await producer.disconnect();
};

module.exports = raiseEvent;
