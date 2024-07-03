module.exports = (sequelize, Sequelize) => {
  const Currency = sequelize.define(
    "currency",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      currency_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      currency_flag: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      currency_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      currency_rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  return Currency;
};
