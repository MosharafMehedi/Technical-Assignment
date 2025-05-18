const sequelize = require("../config/db");
const User = require("./user");
const Room = require("./room");
const Message = require("./message");

Room.belongsToMany(User, { through: "RoomUsers" });
User.belongsToMany(Room, { through: "RoomUsers" });

module.exports = { sequelize, User, Room, Message };
