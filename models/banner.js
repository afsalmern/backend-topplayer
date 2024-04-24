module.exports = (sequelize, Sequelize) => {
    const Banner = sequelize.define('banner', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        image: {
            type: Sequelize.STRING, // Assuming you store image paths
            allowNull: true // Set to false if image is required
        }
    });

    return Banner;
}
