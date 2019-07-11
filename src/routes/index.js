import express from 'express';

import validator from '../middlewares/validator';
import authenticator from '../middlewares/authenticator';
import users from '../controllers/users';
import inventory from '../controllers/inventory';

const router = express.Router();

// auth
router.post('/signup', validator.auth, users.signup);
router.post('/login', validator.auth, users.login);

// inventory
// Create inventory
router.post('/inventory', authenticator, validator.inventory, inventory.create);

// Get all inventory
router.get('/inventory', authenticator, inventory.findAll);

// Get an inventory
router.get(
  '/inventory/:inventoryId', authenticator, validator.checkInventoryParams, inventory.findOne
);

export default router;
