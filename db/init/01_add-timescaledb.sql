CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- CREATE TABLE conditions (
--   time        TIMESTAMPTZ       NOT NULL,
--   location    TEXT              NOT NULL,
--   temperature DOUBLE PRECISION  NULL,
--   humidity    DOUBLE PRECISION  NULL
-- );

-- SELECT create_hypertable('conditions', 'time');