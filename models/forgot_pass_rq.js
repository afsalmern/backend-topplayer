module.exports = (sequelize, Sequelize) => {
    const ForgotPass = sequelize.define('forget_pass_req', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        VC: {
            type: Sequelize.STRING,
            allowNull: false,
        }
    });

    return ForgotPass;
}
