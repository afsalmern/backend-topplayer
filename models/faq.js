module.exports = (sequelize, Sequelize) => {
  const FAQ = sequelize.define("faq", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    question_en: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    question_ar: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    answer_en: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    answer_ar: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  });

  return FAQ;
};