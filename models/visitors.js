module.exports = (sequelize, Sequelize) => {
  const Visitors = sequelize.define("visitors", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    ip: {
      type: Sequelize.STRING,
    },
  });

  return Visitors;
};
