module.exports = (sequelize, DataTypes) => {
  const InfluencerCoupons = sequelize.define(
    "influencer_coupons",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      influencer_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "influencer_persons",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      coupon_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "influencer",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      timestamps: true,
    }
  );

  return InfluencerCoupons;
};
