const express = require('express')
const bookingController = require('../controller/bookingController')
const router = express.Router();
router.post('/bookings', bookingController.createBooking); // Create a new booking
router.get('/bookings', bookingController.getBookings); // Get all bookings for a specific date
router.get('/bookings/:id', bookingController.getBookingById); // Get a booking by ID
router.patch('/bookings/:id', bookingController.patchBooking); // Update a booking
router.delete('/bookings/:id', bookingController.deleteBooking); // Delete a booking

module.exports=router
