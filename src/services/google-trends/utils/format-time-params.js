const formatTimeParams = (inputObject) => {
  let obj = { ...inputObject };
  if (obj.startTime && obj.endTime && obj.startTime > obj.endTime) {
    const temp = obj.startTime;

    obj.startTime = obj.endTime;
    obj.endTime = temp;
  }

  const shouldIncludeTime = isLessThan7Days(obj.startTime, obj.endTime);

  const startTime = convertDateToString(
    obj.startTime,
    shouldIncludeTime && obj.granularTimeResolution
  );
  const endTime = convertDateToString(
    obj.endTime,
    shouldIncludeTime && obj.granularTimeResolution
  );

  obj.time = `${startTime} ${endTime}`;
  return obj;
};

module.exports = formatTimeParams;

function isLessThan7Days(date1, date2) {
  return Math.abs(date2 - date1) / (24 * 60 * 60 * 1000) < 7;
}

function convertDateToString(d, shouldIncludeTime, formatWithoutDashes) {
  let month = (d.getUTCMonth() + 1).toString();
  let day = d.getUTCDate().toString();

  const dash = formatWithoutDashes ? "" : "-";

  month = month.length < 2 ? "0" + month : month;
  day = formatWithoutDashes && day.length < 2 ? "0" + day : day;

  const year = d.getUTCFullYear().toString();
  const hour = d.getUTCHours();
  const minute = d.getUTCMinutes();

  if (shouldIncludeTime) {
    return `${year}${dash}${month}${dash}${day}T${hour}\\:${minute}\\:00`;
  }

  return `${year}${dash}${month}${dash}${day}`;
}
