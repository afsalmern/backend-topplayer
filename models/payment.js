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
    stripe_fee: {
      type: Sequelize.FLOAT,
    },
    courseId: {
      type: Sequelize.INTEGER,
    },
    stripeId: {
      type: Sequelize.STRING,
    },
    fromTamara: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  });

  return Payment;
};
