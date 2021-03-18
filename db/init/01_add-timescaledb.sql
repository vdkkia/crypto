CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

CREATE TABLE IF NOT EXISTS permins (
  interest_plain              INTEGER,
  interest                    DOUBLE PRECISION,
  keyword                     TEXT,
  time_label                  TEXT,
  report_time                 BIGINT,
  time                        TIMESTAMP             NOT NULL,
  batch_no                    INTEGER,
  has_data                    BOOLEAN,
  formatted_axis_time         TEXT,
  formatted_time              TEXT,
  formatted_value             TEXT,
  constraint pk_permin_keyword_time  primary key (keyword, time)
);

SELECT create_hypertable('permins', 'time');

CREATE TABLE IF NOT EXISTS weeklies (
  interest_values             SMALLINT[],
  ref_values                  SMALLINT[],
  report_time                 BIGINT,
  time                        TIMESTAMP             NOT NULL,
  last_value                  SMALLINT,
  is_last_value_partial       BOOLEAN,
  average                     SMALLINT,
  ref_average                 SMALLINT,
  keyword                     TEXT,
  reference                   TEXT,
  constraint pk_weekly_keyword_time primary key (keyword, time)
);

SELECT create_hypertable('weeklies', 'time');



