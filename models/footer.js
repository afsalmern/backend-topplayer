module.exports = (sequelize, Sequelize) => {
  const Footer = sequelize.define("footer", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    footer_en: {
      type: Sequelize.STRING(1000),
      allowNull: false,
    },
    footer_ar: {
      type: Sequelize.STRING(1000),
      allowNull: false,
    },
  });

  return Footer;
};
