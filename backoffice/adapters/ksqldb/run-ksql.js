const axios = require("axios");

const runKSQL = async (ksql, streamsProperties = {}) => {
  const { data } = await axios.post(
    `${process.env.KSQLDB_REST_API_BASE}/ksql`,
    {
      ksql,
      streamsProperties,
    }
  );
  return data;
};

module.exports = runKSQL;
