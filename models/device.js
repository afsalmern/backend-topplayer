module.exports = (sequelize, Sequelize) => {
    const Device = sequelize.define('device', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        deviceID:{
            type: Sequelize.STRING,
        }, 
        
    });

    return Device;
}