module.exports = (sequelize, Sequelize) => {
  const NewsBannerImage = sequelize.define("newsBannerImage", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    banner_text: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    banner_text_ar: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    imageUrl: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return NewsBannerImage;
};
