module.exports = (sequelize, DataTypes) => {
  const DownloadedFile = sequelize.define("DownloadedFile", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    timestamps: true
  });

  return DownloadedFile;
};
