

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

const _Users = _interopRequireDefault(require('./Users'));

const _Inventory = _interopRequireDefault(require('./Inventory'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const _default = {
  Users: _Users.default,
  Inventory: _Inventory.default,
};
exports.default = _default;
