module.exports = (sequelize, Sequelize) => {
    const SubCourse = sequelize.define('sub_course', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        }
    });

    return SubCourse;
}