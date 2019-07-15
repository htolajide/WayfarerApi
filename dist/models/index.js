"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Users = _interopRequireDefault(require("./Users"));

var _Inventory = _interopRequireDefault(require("./Inventory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  Users: _Users["default"],
  Inventory: _Inventory["default"]
};
exports["default"] = _default;