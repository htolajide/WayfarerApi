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
      errors.push(...checkForEmptyFields('Password', password));
      errors.push(...checkForEmptyFields('Email', email));
      errors.push(...checkForEmptyFields('Are you Admin true/false', isAdmin));
      errors.push(...checkPatternedFields('Password', password, passwordRegex));
      errors.push(...checkPatternedFields('Email address', email, emailRegex));
    } else if (req.path.includes('signin')) {
      errors.push(...checkPatternedFields('Email address', email, emailRegex));
      errors.push(...checkForEmptyFields('Password', password));
      errors.push(...checkForEmptyFields('Email', email));
      errors.push(...checkPatternedFields('Password', password, passwordRegex));
      errors.push(...checkForEmptyFields('Are you Admin true/false', isAdmin));
    }
    if (errors.length) {
      return res.jsend.error({
        message: 'Your request contain errors',
        data: errors,
      });
    }
    return next();
  },
  tripCancelData: (req, res, next) => {
    const { status } = req.body;
    const error = checkForEmptyFields('Status', status);
    if (error) {
      return res.jsend.error({
        message: 'Your request contain errors',
        data: error,
      });
    }
    return next();
  },
  checkTripParams: (req, res, next) => {
    const { params: { tripId } } = req;
    const parsedNumber = parseInt(tripId, 10);
    const isInteger = Number.isInteger(parsedNumber);
    const isGreaterThanZero = parsedNumber > 0;
    if (isInteger && isGreaterThanZero) return next();
    return res.jsend.error('Trip ID parameter must be an integer greater than zero');
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
  bookData: (req, res, next) => {
    const { tripId, sitNumber } = req.body;
    const errors = [];
    errors.push(...checkForEmptyFields('Trip Id', tripId));
    errors.push(...checkForEmptyFields('Sit Number', sitNumber));
    if (errors.length) {
      return res.jsend.error({
        message: 'Your request contain errors',
        data: errors,
      });
    }
    return next();
  },
  checkBookingParams: (req, res, next) => {
    const { params: { bookingId } } = req;
    const parsedNumber = parseInt(bookingId, 10);
    const isInteger = Number.isInteger(parsedNumber);
    const isGreaterThanZero = parsedNumber > 0;
    if (isInteger && isGreaterThanZero) return next();
    return res.jsend.error('Booking ID parameter must be an integer greater than zero');
  },
};
