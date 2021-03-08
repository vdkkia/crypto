const Alert = require("./Alert");

const saveAlert = (alertData) => Alert.create(alertData);

module.exports = saveAlert;
