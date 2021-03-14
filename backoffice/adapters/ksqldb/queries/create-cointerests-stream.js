module.exports = `
CREATE STREAM IF NOT EXISTS COINTERESTS (
  REPORT_KEY VARCHAR KEY,
  INTEREST_PLAIN INT,
  INTEREST DOUBLE,
  KEYWORD VARCHAR,
  TIMESTAMP VARCHAR,
  REPORT_TIME BIGINT,
  BATCH_NO INT,
  HAS_DATA BOOLEAN,
  FORMATTED_AXIS_TIME VARCHAR,
  FORMATTED_TIME VARCHAR,
  FORMATTED_VALUE VARCHAR
) WITH (
  KAFKA_TOPIC = 'cointerests',
  PARTITIONS = 1,
  VALUE_FORMAT = 'AVRO',
  TIMESTAMP = 'TIMESTAMP',
  TIMESTAMP_FORMAT = 'yyyyMMDD HH:mm:ss'
);
`;