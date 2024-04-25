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
      type: Sequelize.STRING,
      allowNull: false,
    },
    amount: {
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
  });

  return Course;
};
