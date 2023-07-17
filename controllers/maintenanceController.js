const Maintenance = require('../models/maintenanceModel');

exports.addMaintenance = async (req, res) => {
    try {
        const {
            joborder_number, plate_number,
            date, description,
            notes, pms
        } = req.body;
        await Maintenance.create({
            joborder_number, plate_number,
            date, description,
            notes, pms
        })
        res.status(201).redirect('/maintenance');
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add maintenance',
            error: error.message
        });
    }
};

exports.updateMaintenance = async (req, res) => {
    try {
        const {
            joborder_number, plate_number,
            date, description,
            notes, pms
        } = req.body;

        const maintenance = await Maintenance.findOne({
            where: {
                joborder_number: joborder_number
            }
        })

        if (!maintenance) {
            return res.status(400).json({
                success: false,
                message: 'Maintenance not found'
            })
        }

        maintenance.joborder_number = joborder_number;
        maintenance.plate_number = plate_number;
        maintenance.date = date;
        maintenance.description = description;
        maintenance.notes = notes;
        maintenance.pms = pms;

        await maintenance.save();

        res.status(200).redirect('/maintenance');
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating maintenance',
            error: error.message
        });
    }
}

exports.getMaintenance = async (req, res) => {
    try {
        const maintenance = await Maintenance.findAll({
            attributes: [
                'joborder_number', 'plate_number',
                'date', 'description',
                'notes', 'pms'
            ]
        });
        res.status(200).send(maintenance);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching maintenance',
            error: error.message
        });
    }
};

exports.dropMaintenance = async (req, res) => {
    try {
        const {plate_number} = req.body;

        const maintenance = await Maintenance.findOne({
            where: {
                joborder_number: joborder_number
            }
        })

        if (!maintenance) {
            return res.status(400).json({
                success: false,
                message: 'Maintenance job not found'
            });
        }

        await maintenance.destroy();

        res.status(200).redirect('/maintenance');
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to destroy maintenance job',
            error: error.message
        })
    }
};