module.exports = (sequelize, Sequelize) => {
  const Payouts = sequelize.define(
    "payouts",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      influencer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "influencer_persons",
          key: "id",
        },
      },
      commision_history_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "influencer_commisions",
          key: "id",
        },
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      remarks: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("pending", "approved", "rejected"),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      timestamps: true,
    }
  );

  return Payouts;
};
