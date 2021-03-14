CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

CREATE TABLE cointerests (
  REPORT_KEY TEXT KEY,
  INTEREST_PLAIN INTEGER,
  INTEREST DOUBLE PRECISION,
  KEYWORD TEXT,
  TIMESTAMP TEXT,
  REPORT_TIME BIGINT,
  BATCH_NO INTEGER,
  HAS_DATA BOOLEAN,
  FORMATTED_AXIS_TIME TEXT,
  FORMATTED_TIME TEXT,
  FORMATTED_VALUE TEXT
);

SELECT create_hypertable('cointerests', 'REPORT_TIME');