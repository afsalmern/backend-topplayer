module.exports = (sequelize, Sequelize) => {
  const Course = sequelize.define("courses", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    name_arabic: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    amount: {
      type: Sequelize.FLOAT,
    },
    offerAmount: {
      type: Sequelize.FLOAT,
    },
    description: {
      type: Sequelize.TEXT, // Assuming description can be longer than a string
      allowNull: true, // Depending on your requirements
    },
    description_ar: {
      type: Sequelize.TEXT, // Assuming description can be longer than a string
      allowNull: true, // Depending on your requirements
    },
    imageUrl: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    bannerUrl: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    videoUrl: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    enroll_text: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    enroll_text_ar: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    duration: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  return Course;
};
