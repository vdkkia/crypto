const redis = require("../../adapters/redis");

const KEYWORD_HISTORY_REDIS_PREFIX = "KEYWORD_HISTORY:";
const ONE_WEEK = 7 * 24 * 60 * 60;

let keywordsHistory = {};

const loadKeywordsHistory = async (keywords) => {
  const histories = await Promise.all(
    keywords.map(({ term }) => loadKeywordHistory(term))
  );
  return keywords.map((keyword, index) => ({
    ...keyword,
    history: histories[index],
  }));
};

const saveKeywordHistory = (keyword, history) => {
  keywordsHistory[keyword] = history;
  return redis
    .client()
    .set(
      KEYWORD_HISTORY_REDIS_PREFIX + keyword,
      JSON.stringify(history),
      "EX",
      ONE_WEEK
    );
};

module.exports = { loadKeywordsHistory, saveKeywordHistory };

async function loadKeywordHistory(keyword) {
  if (keyword in keywordsHistory) return keywordsHistory[keyword];
  const keywordHistoryStr = await redis
    .client()
    .get(KEYWORD_HISTORY_REDIS_PREFIX + keyword);
  if (keywordHistoryStr !== null) {
    keywordsHistory[keyword] = JSON.parse(keywordHistoryStr);
    return keywordsHistory[keyword];
  }
  return {};
}
