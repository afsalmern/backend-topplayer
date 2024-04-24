module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define('category', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        description: {
            type: Sequelize.TEXT, // Assuming description can be longer than a string
            allowNull: true, // Depending on your requirements
        }
    });

    return Category;
}