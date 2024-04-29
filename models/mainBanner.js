// Import Sequelize library
const { Sequelize, DataTypes } = require("sequelize");

// Define the model function
module.exports = (sequelize) => {
  // Define the model
  const MainBanner = sequelize.define(
    "main_banner",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
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
      title_text: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      title_text_Ar: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      subhead_ar: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  // Return the model
  return MainBanner;
};
