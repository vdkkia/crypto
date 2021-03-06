const moment = require("moment");
const getProcessedDate = (str) => {
  const token = str.slice(-1);
  const number = str.slice(0, str.length - 1);
  let period = "";
  switch (token) {
    case "m":
      period = "minutes";
      break;
    case "h":
      period = "hours";
      break;
    case "d":
      period = "days";
      break;
    case "w":
      period = "weeks";
      break;
    case "M":
      period = "months";
      break;
    case "y":
      period = "years";
      break;
  }

  return moment().subtract(number, period).toDate();
};

module.exports = {
  getProcessedDate,
};
