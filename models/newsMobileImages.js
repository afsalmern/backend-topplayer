module.exports = (sequelize, Sequelize) => {
    const NewsMobileImage = sequelize.define("newsMobileImage", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
    return NewsMobileImage;
  };
  