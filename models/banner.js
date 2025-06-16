module.exports = (sequelize, Sequelize) => {
  const Banner = sequelize.define("banner", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    heading: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    heading_ar: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    non_animate_text: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    non_animate_text_ar: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    animate_text: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    animate_text_ar: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    para: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    para_ar: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Banner;
};
