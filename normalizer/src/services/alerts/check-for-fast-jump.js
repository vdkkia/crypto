const axios = require("axios");
const logger = require("../logger");

const checkForFastJump = async ({
  jump_factor,
  keyword,
  reference,
  average,
  ref_average,
  last_fixed_value,
}) => {
  try {
    if (last_fixed_value > 0.5 * ref_average && jump_factor > 100) {
      const alertMessage = `Jump factor ${jump_factor} detected on <https://trends.google.com/trends/explore?date=now%204-H&q=${encodeURIComponent(
        keyword
      )}|${keyword}>
`;
      const result = await axios.post(process.env.SLACK_INCOMING_WEBHOOK, {
        text: alertMessage,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: alertMessage,
            },
          },
        ],
      });
    }
  } catch (err) {
    logger.error(`error happened in sending alert to slack channel...`);
    logger.error(err.message);
  }
};

module.exports = checkForFastJump;
