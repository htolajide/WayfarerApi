

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

const _validationHelpers = _interopRequireDefault(require('../utilities/validationHelpers'));

const _regexen = require('../utilities/regexen');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError('Invalid attempt to spread non-iterable instance'); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === '[object Arguments]') return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

const { checkForEmptyFields } = _validationHelpers.default;
const { checkPatternedFields } = _validationHelpers.default;
const _default = {
  auth: function auth(req, res, next) {
    const errors = [];
    const _req$body = req.body;
    const { firstname } = _req$body;
    const { lastname } = _req$body;
    const { email } = _req$body;
    const { password } = _req$body;

    if (req.path.includes('signup')) {
      errors.push.apply(errors, _toConsumableArray(checkForEmptyFields('First name', firstname)));
      errors.push.apply(errors, _toConsumableArray(checkForEmptyFields('Last name', lastname)));
    }

    errors.push.apply(errors, _toConsumableArray(checkPatternedFields('Email address', email, _regexen.emailRegex)));
    errors.push.apply(errors, _toConsumableArray(checkPatternedFields('Password', password, _regexen.passwordRegex)));

    if (errors.length) {
      return res.jsend.error({
        message: 'Your request contain errors',
        data: errors,
      });
    }

    return next();
  },
  inventory: function inventory(req, res, next) {
    const errors = [];
    const _req$body2 = req.body;
    const { category } = _req$body2;
    const { name } = _req$body2;
    const { description } = _req$body2;
    errors.push.apply(errors, _toConsumableArray(checkForEmptyFields('Category', category)));
    errors.push.apply(errors, _toConsumableArray(checkForEmptyFields('Name', name)));
    errors.push.apply(errors, _toConsumableArray(checkPatternedFields('Description', description, _regexen.descriptionRegex)));

    if (errors.length) {
      return res.jsend.error({
        message: 'Your request contain errors',
        data: errors,
      });
    }

    return next();
  },
  checkInventoryParams: function checkInventoryParams(req, res, next) {
    const { inventoryId } = req.params;
    const parsedNumber = parseInt(inventoryId, 10);
    const isInteger = Number.isInteger(parsedNumber);
    const isGreaterThanZero = parsedNumber > 0;
    if (isInteger && isGreaterThanZero) return next();
    return res.jsend.error('Inventory ID must be an integer greater than zero');
  },
};
exports.default = _default;
