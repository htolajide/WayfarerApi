

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

const _express = _interopRequireDefault(require('express'));

const _validator = _interopRequireDefault(require('../middlewares/validator'));

const _authenticator = _interopRequireDefault(require('../middlewares/authenticator'));

const _users = _interopRequireDefault(require('../controllers/users'));

const _inventory = _interopRequireDefault(require('../controllers/inventory'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router(); // auth


router.post('/signup', _validator.default.auth, _users.default.signup);
router.post('/login', _validator.default.auth, _users.default.login); // users

router.get('/users', _users.default.seeUser); // Create inventory

router.post('/inventory', _authenticator.default, _validator.default.inventory, _inventory.default.create); // Get all inventory

router.get('/inventory', _authenticator.default, _inventory.default.findAll); // Get an inventory

router.get('/inventory/:inventoryId', _authenticator.default, _validator.default.checkInventoryParams, _inventory.default.findOne);
const _default = router;
exports.default = _default;
