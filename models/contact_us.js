module.exports = (sequelize, Sequelize) => {
  const Contact = sequelize.define("contact_us", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    message: {
      type: Sequelize.STRING(1234),
    },
  });

  return Contact;
};
