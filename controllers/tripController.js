const Trip = require('../models/tripModel');

exports.addTrip = async (req, res) => {
    try {
        const {
            trip_number, plate_number, date,
            account, route, origin,
            destination, trip_mileage,
            total_mileage
        } = req.body;
        await Trip.create({
            trip_number, plate_number, date,
            account, route, origin,
            destination, trip_mileage,
            total_mileage
        });
        res.status(201).redirect('/trips');
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add trip',
            error: error.message
        });
    }
};

exports.updateTrip = async (req, res) => {
    try {
        const {
            trip_number, plate_number,
            date, account, route,
            origin, destination,
            trip_mileage, total_mileage
        } = req.body;

        const trip = await Trip.findOne({
            where: {
                trip_number: trip_number
            }
        })

        if (!trip) {
            return res.status(400).json({
                success: false,
                message: 'Trip not found'
            })
        }

        trip.trip_number = trip_number;
        trip.plate_number = plate_number;
        trip.date = date;
        trip.account = account;
        trip.route = route;
        trip.origin = origin;
        trip.destination = destination;
        trip.trip_mileage = trip_mileage;
        trip.total_mileage = total_mileage;

        await trip.save();

        res.status(200).redirect('/trips');
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating trip',
            error: error.message
        });
    }
}

exports.getTrips = async (req, res) => {
    try {
        const trips = await Trip.findAll({
            attributes: [
                'trip_number', 'plate_number',
                'date', 'account', 'route', 'origin',
                'destination', 'trip_mileage',
                'total_mileage'
            ]
        });
        res.send(trips);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching trips',
            error: error.message
        });
    }
};

exports.dropTrip = async (req, res) => {
    try {
        const {trip_number} = req.body;

        const trip = await Trip.findOne({
            where: {
                trip_number: trip_number
            }
        })

        if (!trip) {
            return res.status(400).json({
                success: false,
                message: 'Trip not found'
            });
        }

        await trip.destroy();

        res.status(200).redirect('/trips');
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to destroy trip',
            error: error.message
        })
    }
};