const { producer } = require("./../../../adapters/kafka");

const raiseEvent = async ({ topic, payload }) => {
  await producer.connect();
  const result = await producer.send({
    topic,
    messages: [
      {
        value: typeof payload === "string" ? payload : JSON.stringify(payload),
      },
    ],
  });
  await producer.disconnect();
  return result;
};

module.exports = raiseEvent;
