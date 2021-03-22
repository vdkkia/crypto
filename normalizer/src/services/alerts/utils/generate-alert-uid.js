const generateReportUid = ({
  keyword,
  reportTime,
  weeklyTrendReportTime,
  refTrendReportTime,
}) =>
  `${Buffer.from(keyword).toString(
    "base64"
  )}_${reportTime}_${weeklyTrendReportTime}_${refTrendReportTime}`;

module.exports = generateReportUid;
