const {Sequelize, DataTypes} = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db/truckmgr.db'
});

const Maintenance = sequelize.define('Maintenance', {
    joborder_number: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
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
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    notes: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pms: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {tableName: 'maintenance_data', timestamps: false})

module.exports = Maintenance;