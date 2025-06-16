module.exports = (sequelize, Sequelize) => {
    const BannerImage = sequelize.define("bannerImage", {
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
    return BannerImage;
  };
  