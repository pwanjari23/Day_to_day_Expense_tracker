const { Sequelize } = require("sequelize");
const sequelize = require("../config/sequelize");
const User = require("./user");
const Expense = require("./expense");
const downloadedFile = require("./downloadedFile");

const UserReport = require("./userReport")(sequelize, Sequelize.DataTypes);

User.hasMany(UserReport);
UserReport.belongsTo(User);

module.exports = {
  sequelize,
  User,
  Expense,
  downloadedFile,
  UserReport,
};
