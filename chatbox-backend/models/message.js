const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user");
const Room = require("./room");

const Message = sequelize.define("Message", {
  content: DataTypes.STRING,
});

User.hasMany(Message);
Message.belongsTo(User);

Room.hasMany(Message);
Message.belongsTo(Room);

module.exports = Message;
