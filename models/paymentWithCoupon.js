module.exports = (sequelize, Sequelize) => {
  const PaymentWithCoupon = sequelize.define("paymentWithCoupon", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
  });

  return PaymentWithCoupon;
};
