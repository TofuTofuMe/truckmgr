const {Sequelize, DataTypes} = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db/truckmgr.db',
});

const Trip = sequelize.define('Trip', {
    trip_number: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        // autoIncrement: true,
        // allowNull: true,
    },
    plate_number: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'vehicle_data',
            key: 'plate_number'
        }
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    account: {
        type: DataTypes.STRING,
        allowNull: false
    },
    route: {
        type: DataTypes.STRING,
        allowNull: false
    },
    origin: {
        type: DataTypes.STRING,
        allowNull: false
    },
    destination: {
        type: DataTypes.STRING,
        allowNull: false
    },
    trip_mileage: {
        type: DataTypes.STRING,
        allowNull: false
    },
    total_mileage: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {tableName: 'trip_data', timestamps: false})

module.exports = Trip;