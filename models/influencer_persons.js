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
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
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
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      timestamps: true,
    }
  );

  return InfluencerPersons;
};
