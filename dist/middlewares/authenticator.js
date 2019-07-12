"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = function _default(req, res, next) {
  var token = req.cookies.token;
  if (!token) return res.jsend.error('Unauthenticated!');

  try {
    var user = _jsonwebtoken["default"].decode(token, process.env.SECRET);

    req.user = user;
    return next();
  } catch (error) {
    return res.jsend.error({
      message: 'authentication failed',
      data: error
    });
  }
};

exports["default"] = _default;