import express from 'express';
import validator from '../middlewares/validator';
import authenticator from '../middlewares/authenticator';
import users from '../controllers/users';
import inventory from '../controllers/inventory';
import trip from '../controllers/trips';


const router = express.Router();

// auth/signup
router.post('/auth/signup', validator.auth, users.signup);
// auth/signin
router.post('/auth/signin', validator.auth, users.login);

// Create inventory
router.post('/trip', authenticator, validator.tripData, trip.create);

// Get all inventory
router.get('/trip', authenticator, inventory.findAll);

// Get an inventory
router.get(
  '/trip/:tripId', authenticator, validator.checkTripParams, inventory.findOne,
);

export default router;
