const axios = require("axios");

const defaultConf = {
  "connector.class": "io.confluent.connect.jdbc.JdbcSinkConnector",
  topics: "cointerests",
  "key.converter": "org.apache.kafka.connect.storage.StringConverter",
  "value.converter": "io.confluent.connect.avro.AvroConverter",
  "value.converter.schema.registry.url": process.env.KAFKA_SCHEMA_REGISTRY_URI,
  "connection.url": `jdbc:postgresql://${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`,
  "connection.user": process.env.POSTGRES_USER,
  "connection.password": process.env.POSTGRES_PASSWORD,
  "auto.create": true,
  "auto.evolve": true,
  "insert.mode": "upsert",
  "pk.mode": "record_key",
  "pk.fields": "REPORT_KEY",
};

const addPostgresConnector = async (
  name = "sink-jdbc-postgres-001",
  config = defaultConf
) => {
  const { data } = await axios.put(
    `${process.env.KAFKA_CONNECT_REST_API_BASE}/connectors/${name}/config`,
    config
  );

  return data;
};

module.exports = addPostgresConnector;
