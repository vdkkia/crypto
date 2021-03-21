const axios = require("axios");
const logger = require("../logger");

const channels = [
  process.env.SLACK_INCOMING_WEBHOOK_1,
  process.env.SLACK_INCOMING_WEBHOOK_2,
  process.env.SLACK_INCOMING_WEBHOOK_3,
  process.env.SLACK_INCOMING_WEBHOOK_4,
  process.env.SLACK_INCOMING_WEBHOOK_5,
  process.env.SLACK_INCOMING_WEBHOOK_6,
  process.env.SLACK_INCOMING_WEBHOOK_7,
  process.env.SLACK_INCOMING_WEBHOOK_8,
  process.env.SLACK_INCOMING_WEBHOOK_9,
  process.env.SLACK_INCOMING_WEBHOOK_10,
];

const checkForFastJump = async (
  { jump_factor, keyword, reference, average, ref_average, last_fixed_value },
  relativeScale
) => {
  try {
    let channelIndex = null;
    const jumpFactor = jump_factor;
    const jumpFactorNormalized = jumpFactor * relativeScale;

    if (jumpFactor >= 100 && jumpFactorNormalized >= 1) channelIndex = 9;
    else if (jumpFactor >= 20 && jumpFactor < 100 && jumpFactorNormalized >= 1)
      channelIndex = 8;
    else if (jumpFactor >= 10 && jumpFactor < 20 && jumpFactorNormalized >= 2)
      channelIndex = 7;
    else if (
      jumpFactor >= 10 &&
      jumpFactor < 20 &&
      jumpFactorNormalized >= 0.5 &&
      jumpFactorNormalized < 2
    )
      channelIndex = 6;
    else if (jumpFactor >= 7 && jumpFactor < 10 && jumpFactorNormalized >= 2)
      channelIndex = 5;
    else if (
      jumpFactor >= 7 &&
      jumpFactor < 10 &&
      jumpFactorNormalized >= 0.5 &&
      jumpFactorNormalized < 2
    )
      channelIndex = 4;
    else if (jumpFactor >= 5 && jumpFactor < 7 && jumpFactorNormalized >= 2)
      channelIndex = 3;
    else if (
      jumpFactor >= 5 &&
      jumpFactor < 7 &&
      jumpFactorNormalized >= 0.5 &&
      jumpFactorNormalized < 2
    )
      channelIndex = 2;
    else if (jumpFactor >= 3.5 && jumpFactor < 5 && jumpFactorNormalized >= 2)
      channelIndex = 1;
    else if (
      jumpFactor >= 3.5 &&
      jumpFactor < 5 &&
      jumpFactorNormalized >= 0.5 &&
      jumpFactorNormalized < 2
    )
      channelIndex = 0;

    if (channelIndex !== null) {
      const alertMessage = `Jump factor ${jumpFactor.toFixed(
        2
      )} detected on <https://trends.google.com/trends/explore?date=now%204-H&q=${encodeURIComponent(
        keyword
      )},arweave|${keyword}> | channel ${channelIndex}
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
