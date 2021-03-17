CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

CREATE TABLE "cointerests"(
  "REPORT_KEY" text primary key,
  "INTEREST_PLAIN" integer,
  "INTEREST" double precision,
  "KEYWORD" text,
  "TIMESTAMP" text,
  "REPORT_TIME" bigint,
  "BATCH_NO" integer,
  "HAS_DATA" boolean,
  "FORMATTED_AXIS_TIME" text,
  "FORMATTED_TIME" text,
  "FORMATTED_VALUE" text
);

CREATE TABLE moving_average (
  "KEYWORD" text,
  "RATIO" double precision,
  "CALC_TIME" text
);

SELECT create_hypertable('cointerests', 'REPORT_TIME', chunk_time_interval => 604800000);

CREATE TABLE moving_average (
  "KEYWORD" text,
  "RATIO" double precision,
  "CALC_TIME" text
);

