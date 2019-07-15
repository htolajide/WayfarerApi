"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _models = _interopRequireDefault(require("../models"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Users = _models["default"].Users;
var _default = {
  signup: function () {
    var _signup = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(req, res) {
      var _req$body, firstname, lastname, email, password, foundUser, user, token;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _req$body = req.body, firstname = _req$body.firstname, lastname = _req$body.lastname, email = _req$body.email, password = _req$body.password; // check for existence

              foundUser = Users.list.find(function (user) {
                return user.email === email;
              });

              if (!foundUser) {
                _context.next = 4;
                break;
              }

              return _context.abrupt("return", res.jsend.fail('Email address already exists.'));

            case 4:
              _context.t0 = Users.list.length + 1;
              _context.t1 = firstname;
              _context.t2 = lastname;
              _context.t3 = email;
              _context.next = 10;
              return _bcrypt["default"].hash(password, 10);

            case 10:
              _context.t4 = _context.sent;
              user = {
                id: _context.t0,
                firstname: _context.t1,
                lastname: _context.t2,
                email: _context.t3,
                password: _context.t4
              };
              // persist user to database
              Users.create(user); // sign jwt and wrap in a cookie

              token = _jsonwebtoken["default"].sign({
                userId: user.id
              }, process.env.SECRET);
              res.cookie('token', token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true
              });
              return _context.abrupt("return", res.jsend.success(token));

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function signup(_x, _x2) {
      return _signup.apply(this, arguments);
    }

    return signup;
  }(),
  //get all users
  seeUser: function seeUser(req, res) {
    return res.jsend.success(Users);
  },
  login: function () {
    var _login = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(req, res) {
      var _req$body2, email, password, foundUser, match, token;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
              foundUser = Users.list.find(function (user) {
                return user.email === email;
              });

              if (foundUser) {
                _context2.next = 4;
                break;
              }

              return _context2.abrupt("return", res.jsend.fail('user does not exist.'));

            case 4:
              _context2.next = 6;
              return _bcrypt["default"].compare(password, foundUser.password);

            case 6:
              match = _context2.sent;

              if (match) {
                _context2.next = 9;
                break;
              }

              return _context2.abrupt("return", res.jsend.fail('Login failed!'));

            case 9:
              // sign jwt and wrap in a cookie
              token = _jsonwebtoken["default"].sign({
                userId: foundUser.id
              }, process.env.SECRET);
              res.cookie('token', token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true
              });
              return _context2.abrupt("return", res.jsend.success(token));

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    function login(_x3, _x4) {
      return _login.apply(this, arguments);
    }

    return login;
  }()
};
exports["default"] = _default;