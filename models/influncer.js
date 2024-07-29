module.exports = (sequelize, Sequelize) => {
  const Influencer = sequelize.define("influencer", {
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
    phone: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    coupon_code: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    coupon_percentage: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    expire_in: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    max_apply_limit: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Influencer;
};
