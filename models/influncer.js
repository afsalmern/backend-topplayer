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
      allowNull: true,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    coupon_code: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    commision_percentage: {
      type: Sequelize.INTEGER,
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
    start_in: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    is_deleted: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    max_apply_limit: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Influencer;
};
