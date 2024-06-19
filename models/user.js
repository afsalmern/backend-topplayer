module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    verification_code: {
      type: Sequelize.STRING,
    },
    mobile: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    verified: {
      type: Sequelize.BOOLEAN,
    },
    bio: {
      type: Sequelize.STRING,
    },
    stripe_customer_id: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    deviceCount: {
      type: Sequelize.INTEGER,
      defaultValue: 2,
      validate: {
        max: {
          args: 11,
          msg: "Device count cannot exceed 5",
        },
      },
    },
  });

  return User;
};
