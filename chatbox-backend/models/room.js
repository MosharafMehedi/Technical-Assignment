const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Room = sequelize.define("Room", {
  name: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Room;
