module.exports = (sequelize, DataTypes) => {
  const InfluencerPersons = sequelize.define(
    "influencer_persons",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("active", "blocked"),
        allowNull: false,
        defaultValue: "active",
      },
      role: {
        type: DataTypes.ENUM("influencer"),
        allowNull: false,
        defaultValue: "influencer",
      },
    },
    {
      timestamps: true,
    }
  );

  return InfluencerPersons;
};
