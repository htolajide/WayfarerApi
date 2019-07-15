"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _validationHelpers = _interopRequireDefault(require("../utilities/validationHelpers"));

var _regexen = require("../utilities/regexen");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var checkForEmptyFields = _validationHelpers["default"].checkForEmptyFields,
    checkPatternedFields = _validationHelpers["default"].checkPatternedFields;
var _default = {
  auth: function auth(req, res, next) {
    var errors = [];
    var _req$body = req.body,
        firstname = _req$body.firstname,
        lastname = _req$body.lastname,
        email = _req$body.email,
        password = _req$body.password;

    if (req.path.includes('signup')) {
      errors.push.apply(errors, _toConsumableArray(checkForEmptyFields('First name', firstname)));
      errors.push.apply(errors, _toConsumableArray(checkForEmptyFields('Last name', lastname)));
    }

    errors.push.apply(errors, _toConsumableArray(checkPatternedFields('Email address', email, _regexen.emailRegex)));
    errors.push.apply(errors, _toConsumableArray(checkPatternedFields('Password', password, _regexen.passwordRegex)));

    if (errors.length) {
      return res.jsend.error({
        message: 'Your request contain errors',
        data: errors
      });
    }

    return next();
  },
  inventory: function inventory(req, res, next) {
    var errors = [];
    var _req$body2 = req.body,
        category = _req$body2.category,
        name = _req$body2.name,
        description = _req$body2.description;
    errors.push.apply(errors, _toConsumableArray(checkForEmptyFields('Category', category)));
    errors.push.apply(errors, _toConsumableArray(checkForEmptyFields('Name', name)));
    errors.push.apply(errors, _toConsumableArray(checkPatternedFields('Description', description, _regexen.descriptionRegex)));

    if (errors.length) {
      return res.jsend.error({
        message: 'Your request contain errors',
        data: errors
      });
    }

    return next();
  },
  checkInventoryParams: function checkInventoryParams(req, res, next) {
    var inventoryId = req.params.inventoryId;
    var parsedNumber = parseInt(inventoryId, 10);
    var isInteger = Number.isInteger(parsedNumber);
    var isGreaterThanZero = parsedNumber > 0;
    if (isInteger && isGreaterThanZero) return next();
    return res.jsend.error('Inventory ID must be an integer greater than zero');
  }
};
exports["default"] = _default;