module.exports = (sequelize, Sequelize) => {
    const Congrats = sequelize.define("congrats", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      heading: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      heading_ar: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sub_text: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sub_text_ar: {
        type: Sequelize.STRING,
        allowNull: false,
      },

    });
    return Congrats;
  };
  