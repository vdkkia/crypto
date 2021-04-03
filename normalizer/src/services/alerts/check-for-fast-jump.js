const axios = require("axios");
const logger = require("../logger");
const generateReportUid = require("./utils/generate-alert-uid");

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
  {
    jump_factor,
    keyword,
    reference,
    average,
    ref_average,
    last_fixed_value,
    report_time,
    relative_jump_factor,
  },
  relativeScale,
  weeklyTrend,
  refTrend
) => {
  try {
    let channelIndex = null;
    const jumpFactor = jump_factor;
    const jumpFactorNormalized = relative_jump_factor;

    if (jumpFactor >= 20 && jumpFactorNormalized >= 10) channelIndex = 9;
    else if (jumpFactor >= 20 && jumpFactor < 10 && jumpFactorNormalized >= 5)
      channelIndex = 8;
    else if (jumpFactor >= 10 && jumpFactor < 20 && jumpFactorNormalized >= 10)
      channelIndex = 7;
    else if (
      jumpFactor >= 10 &&
      jumpFactor < 20 &&
      jumpFactorNormalized >= 5 &&
      jumpFactorNormalized < 10
    )
      channelIndex = 6;
    else if (jumpFactor >= 5 && jumpFactor < 10 && jumpFactorNormalized >= 20)
      channelIndex = 5;
    else if (
      jumpFactor >= 5 &&
      jumpFactor < 10 &&
      jumpFactorNormalized >= 10 &&
      jumpFactorNormalized < 20
    )
      channelIndex = 4;
    else if (jumpFactor >= 3 && jumpFactor < 5 && jumpFactorNormalized >= 25)
      channelIndex = 3;
    else if (
      jumpFactor >= 3 &&
      jumpFactor < 5 &&
      jumpFactorNormalized >= 15 &&
      jumpFactorNormalized < 25
    )
      channelIndex = 2;

    if (channelIndex !== null) {
      const alertMessage = `Jump factor ${jumpFactor.toFixed(
        2
      )} (relative = ${jumpFactorNormalized.toFixed(
        2
      )}) detected on <https://trends.google.com/trends/explore?date=now%201-d&q=${encodeURIComponent(
        keyword
      )},arweave|${keyword}> | channel ${channelIndex} | <https://www.google.com/search?q=${generateReportUid(
        {
          keyword,
          reportTime: report_time,
          weeklyTrendReportTime: weeklyTrend.record.report_time,
          refTrendReportTime: refTrend.record.report_time,
        }
      )}|uid>
`;
      const result = await axios.post(channels[channelIndex], {
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
