// Import Sequelize library
const { Sequelize, DataTypes } = require("sequelize");

// Define the model function
module.exports = (sequelize) => {
  // Define the model
  const WhoAreWe = sequelize.define(
    "who_are_we",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      experience: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      users: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      courses: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      videoUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      head: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      subhead: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      head_ar: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      subhead_ar: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      // Specify the table name explicitly without the last 's'
      tableName: "who_are_we",
      // Optional timestamps
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  // Return the model
  return WhoAreWe;
};
