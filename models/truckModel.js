const {Sequelize, DataTypes} = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db/truckmgr.db',
});

const Truck = sequelize.define('Truck', {
    plate_number: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    year_model: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mv_filenumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    or_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    make: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {tableName: 'vehicle_data', timestamps: false})

module.exports = Truck;