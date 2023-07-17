const Truck = require('../models/truckModel');

exports.addTruck = async (req, res) => {
    try {
        const {
            plate_number, year_model,
            mv_filenumber, or_number,
            make, type
        } = req.body;
        await Truck.create({
            plate_number, year_model,
            mv_filenumber, or_number,
            make, type
        })
        res.status(201).redirect('/trucks');
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add truck',
            error: error.message
        });
    }
};

exports.updateTruck = async (req, res) => {
    try {
        const {
            plate_number, year_model,
            mv_filenumber, or_number,
            make, type
        } = req.body;

        const truck = await Truck.findOne({
            where: {
                plate_number: plate_number
            }
        })

        if (!truck) {
            return res.status(400).json({
                success: false,
                message: 'Truck not found'
            })
        }

        truck.plate_number = plate_number;
        truck.year_model = year_model;
        truck.mv_filenumber = mv_filenumber;
        truck.or_number = or_number;
        truck.make = make,
        truck.type = type,

        await truck.save();

        res.status(200).redirect('/trucks');
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating truck',
            error: error.message
        });
    }
}

exports.getTrucks = async (req, res) => {
    try {
        const trucks = await Truck.findAll({
            attributes: [
                'plate_number', 'year_model',
                'mv_filenumber', 'or_number',
                'make', 'type'
            ]
        });
        res.status(200).send(trucks);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching trucks',
            error: error.message
        });
    }
};

exports.dropTruck = async (req, res) => {
    try {
        const {plate_number} = req.body;

        const truck = await Truck.findOne({
            where: {
                plate_number: plate_number
            }
        })

        if (!truck) {
            return res.status(400).json({
                success: false,
                message: 'Truck not found'
            });
        }

        await truck.destroy();

        res.status(200).redirect('/trucks');
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to destroy truck',
            error: error.message
        })
    }
};