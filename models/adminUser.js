module.exports = (sequelize, Sequelize) => {
  const AdminUser = sequelize.define("admin_user", {
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
    password: {
      type: Sequelize.STRING,
    },
    role: {
      type: Sequelize.ENUM("admin", "influencer"),
      allowNull: false,
      defaultValue: "influencer",
    },
  });

  return AdminUser;
};
