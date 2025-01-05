const Joi = require('joi');
const Booking = require('../model/bookingModel');

// Validation Schema
const bookingSchema = Joi.object({
    date: Joi.string().required(),
    time: Joi.string().required(),
    guests: Joi.number().integer().min(1).required(),
    name: Joi.string().min(3).max(100).required(),
    contact: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required() // Validates a 10-digit phone number
        .messages({ 'string.pattern.base': 'Contact must be a valid 10-digit phone number.' }),
    email: Joi.string().email().required(),
});

exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({});

        if (!bookings || bookings.length === 0) {
            return res.status(200).json({ 
                success: true, 
                message: 'No bookings found.' 
            });
        }

        res.status(200).json({ 
            success: true, 
            count: bookings.length, 
            data: bookings 
        });
    } catch (error) {
        console.error('Error fetching bookings:', error);

        if (error.name === 'CastError' || error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid request data.' 
            });
        }

        res.status(500).json({ 
            success: false, 
            error: 'Server error. Please try again later.' 
        });
    }
};

exports.deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedBooking = await Booking.findOneAndDelete({ _id: id });

        if (!deletedBooking) {
            return res.status(404).json({ 
                success: false, 
                error: 'Booking not found.' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Booking deleted successfully.' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Server error.' 
        });
    }
};

exports.createBooking = async (req, res) => {
    try {
        const { error } = bookingSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ 
                success: false, 
                error: error.details[0].message 
            });
        }

        const { date, time, guests, name, contact, email } = req.body;

        const currentDateTime = new Date();
        const bookingDateTime = new Date(`${date}T${time}`);

        if (bookingDateTime < currentDateTime) {
            return res.status(400).json({ 
                success: false, 
                error: 'Booking date and time must be in the future.' 
            });
        }

        const isSlotTaken = await Booking.findOne({ date, time });
        if (isSlotTaken) {
            return res.status(400).json({ 
                success: false, 
                error: 'This slot is already booked.' 
            });
        }

        const newBooking = await Booking.create({ date, time, guests, name, contact, email });
        res.status(201).json({ 
            success: true, 
            message: 'Booking created successfully.', 
            data: newBooking 
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                error: 'Duplicate booking detected. The date and time slot is already taken.' 
            });
        }
        res.status(500).json({ 
            success: false, 
            error: 'Server error.', 
            details: error.message 
        });
    }
};

exports.getBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ 
                success: false, 
                error: 'Booking ID is required.' 
            });
        }

        const booking = await Booking.findOne({ _id: id }, { _id: 0, __v: 0 });

        if (!booking) {
            return res.status(404).json({ 
                success: false, 
                error: 'Booking not found.' 
            });
        }

        res.status(200).json({ 
            success: true, 
            data: booking 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Server error.', 
            details: error.message 
        });
    }
};

exports.patchBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const { error } = bookingSchema.validate(updateData, { abortEarly: false });
        if (error) {
            return res.status(400).json({ 
                success: false, 
                error: error.details.map(detail => detail.message) 
            });
        }

        const currentDateTime = new Date();
        const bookingDateTime = new Date(`${updateData.date}T${updateData.time}`);

        if (bookingDateTime < currentDateTime) {
            return res.status(400).json({ 
                success: false, 
                error: 'Booking date and time must be greater than or equal to the current date and time.' 
            });
        }

        const existingBooking = await Booking.findOne({ _id: id });
        if (!existingBooking) {
            return res.status(404).json({ 
                success: false, 
                error: 'Booking not found.' 
            });
        }

        if (updateData.date && updateData.time) {
            const isSlotTaken = await Booking.findOne({ date: updateData.date, time: updateData.time });
            if (isSlotTaken && isSlotTaken._id.toString() !== id) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'This slot is already booked.' 
                });
            }
        }

        const updatedBooking = await Booking.findOneAndUpdate(
            { _id: id },
            { $set: updateData },
            { new: true }
        );

        res.status(200).json({ 
            success: true, 
            message: 'Booking updated successfully.', 
            data: updatedBooking 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Server error.', 
            details: error.message 
        });
    }
};