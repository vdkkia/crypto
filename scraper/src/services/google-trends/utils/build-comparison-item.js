const formatTimeParams = require("./format-time-params");

const buildComparisonItem = (obj) => {
  const finalObj = formatTimeParams(obj);

  const isMultiRegion = finalObj.geo && Array.isArray(finalObj.geo);
  let isMultiKeyword = Array.isArray(finalObj.keyword);

  if (isMultiRegion && !isMultiKeyword) {
    finalObj.keyword = Array(finalObj.geo.length).fill(finalObj.keyword);
    isMultiKeyword = true;
  }

  if (isMultiKeyword) {
    let items = finalObj.keyword.reduce((arr, keyword) => {
      arr.push({ ...finalObj, keyword });

      return arr;
    }, []);

    if (isMultiRegion) {
      finalObj.geo.forEach((region, index) => {
        items[index].geo = region;
      });
    }

    return items;
  }

  return [finalObj];
};

module.exports = buildComparisonItem;
