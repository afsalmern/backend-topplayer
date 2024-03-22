module.exports = (sequelize, Sequelize) => {
    const Video = sequelize.define('video', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name:{
            type: Sequelize.STRING,
            allowNull: false,
        },
        day: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        url:{
            type: Sequelize.STRING,
            allowNull: false,
        },frameURL:{
            type: Sequelize.STRING,
            allowNull: true,
        }
    });

    return Video;
}
