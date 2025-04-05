module.exports = (sequelize, Sequelize) => {
  const InfluencerCommisions = sequelize.define(
    "influencer_commisions",
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
      coupon_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "influencers",
          key: "id",
        },
      },
      payment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "payments",
          key: "id",
        },
      },
      commision_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      commision_percentage: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      net_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      country_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );

  return InfluencerCommisions;
};
