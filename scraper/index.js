const raiseEvent = require("./adapters/kafka/raise-event");

(async () => {
  try {
    await raiseEvent({ topic: "welcome", payload: "Hi dude" });
  } catch (err) {
    console.error(err);
  }
})();
