module.exports = (sequelize, Sequelize) => {
  const TermsAndConditions = sequelize.define("termsAndConditions", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    content: {
      type: Sequelize.TEXT,
    },
    content_ar: {
      type: Sequelize.TEXT,
    },
  });

  return TermsAndConditions;
};
