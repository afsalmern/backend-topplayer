module.exports = (sequelize, Sequelize) => {
    const Subscriber = sequelize.define('subscriber', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        email:{
            type: Sequelize.STRING
        }
    });

    return Subscriber;
}
