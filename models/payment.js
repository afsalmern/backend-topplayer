module.exports = (sequelize, Sequelize) => {
  const Payment = sequelize.define("payment", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    amount: {
      type: Sequelize.FLOAT,
    },
    net_amount: {
      type: Sequelize.FLOAT,
    },
    courseId: {
      type: Sequelize.INTEGER,
    },
    stripeId: {
      type: Sequelize.STRING,
    },
  });

  return Payment;
};
