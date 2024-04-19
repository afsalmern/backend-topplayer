module.exports = (sequelize, Sequelize) => {
    const News = sequelize.define('news', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        title_en: {
            type: Sequelize.STRING,
            allowNull: false
        },
        title_ar: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description_en: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        description_ar: {
            type: Sequelize.TEXT,
            allowNull: false
        }
    });

    return News;
}