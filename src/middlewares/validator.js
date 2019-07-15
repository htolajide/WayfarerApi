import validationHelpers from '../utilities/validationHelpers';
import { emailRegex, passwordRegex } from '../utilities/regexen';

const { checkForEmptyFields, checkPatternedFields } = validationHelpers;

export default {
  auth: (req, res, next) => {
    const errors = [];
    const {
      email, firstName, lastName, password, isAdmin,
    } = req.body;

    if (req.path.includes('signup')) {
      errors.push(...checkForEmptyFields('First name', firstName));
      errors.push(...checkForEmptyFields('Last name', lastName));
    }
    errors.push(...checkPatternedFields('Email address', email, emailRegex));
    errors.push(...checkPatternedFields('Password', password, passwordRegex));
    errors.push(...checkForEmptyFields('Are you Admin true/false', isAdmin));

    if (errors.length) {
      return res.jsend.error({
        message: 'Your request contain errors',
        data: errors,
      });
    }
    return next();
  },
  tripData: (req, res, next) => {
    const errors = [];
    const {
      busId, origin, destination, fare,
    } = req.body;
    errors.push(...checkForEmptyFields('BusId', busId));
    errors.push(...checkForEmptyFields('Origin', origin));
    errors.push(...checkForEmptyFields('Destination', destination));
    errors.push(...checkForEmptyFields('Fare', fare));

    if (errors.length) {
      return res.jsend.error({
        message: 'Your request contain errors',
        data: errors,
      });
    }
    return next();
  },
  checkTripParams: (req, res, next) => {
    const { params: { inventoryId } } = req;
    const parsedNumber = parseInt(inventoryId, 10);
    const isInteger = Number.isInteger(parsedNumber);
    const isGreaterThanZero = parsedNumber > 0;
    if (isInteger && isGreaterThanZero) return next();
    return res.jsend.error('Inventory ID must be an integer greater than zero');
  },
};
