const rawKeywords = require("../../../data/keywords.json");

let keywords = rawKeywords.map(({ term, symbol }) => ({
  term: term.trim(),
  symbol,
}));

if (process.env.NODE_ENV !== "production") {
  keywords = keywords.slice(0, 10);
}

module.exports = keywords;
