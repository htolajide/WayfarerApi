"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var Users = {
  create: function create(user) {
    return Users.list.push(user);
  },
  list: []
};
var _default = Users;
exports["default"] = _default;