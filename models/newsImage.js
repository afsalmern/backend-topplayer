module.exports = (sequelize, Sequelize) => {
  const NewsImage = sequelize.define("newsImage", {
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
  return NewsImage;
};
