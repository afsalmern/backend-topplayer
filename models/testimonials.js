module.exports = (sequelize, Sequelize) => {
  const Testimonial = sequelize.define("testimonial", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    rating: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    comment_en: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    comment_ar: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    user_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    user_name_ar: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    courseId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  return Testimonial;
};
