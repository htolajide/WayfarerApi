import express from 'express';
import validator from '../middlewares/validator';
import authenticator from '../middlewares/authenticator';
import users from '../controllers/users';
import trip from '../controllers/trips';
import booking from '../controllers/bookings';


const router = express.Router();

// auth/signup
router.post('/auth/signup', validator.auth, users.signup);
// auth/signin
router.post('/auth/signin', validator.auth, users.login);

// Create trip
router.post('/trip', authenticator, validator.tripData, trip.create);

// Get all trip
router.get('/trips', authenticator, trip.seeAllTrips);

// Cancel a trip
router.patch('/trips/:tripId', authenticator, validator.checkTripParams, trip.cancelTrip);

// Create booking
router.post('/bookings', authenticator, validator.bookData, booking.create);

export default router;
