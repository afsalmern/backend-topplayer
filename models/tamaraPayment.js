module.exports = (sequelize, Sequelize) => {
  const TamaraPayment = sequelize.define("tamara_payment", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    amount: {
      type: Sequelize.FLOAT,
    },
    userId: {
      type: Sequelize.INTEGER,
    },
    courseId: {
      type: Sequelize.INTEGER,
    },
    referenceOrderId: {
      type: Sequelize.STRING,
    },
    referenceId: {
      type: Sequelize.STRING,
    },
    orderId: {
      type: Sequelize.STRING,
    },
    coupon_code: {
      type: Sequelize.STRING,
    },
    currency_code: {
      type: Sequelize.STRING,
    },
  });

  return TamaraPayment;
};
