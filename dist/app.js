"use strict";

require("@babel/polyfill");

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _express = _interopRequireDefault(require("express"));

var _jsend = _interopRequireDefault(require("jsend"));

var _morgan = _interopRequireDefault(require("morgan"));

var _routes = _interopRequireDefault(require("./routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var app = (0, _express["default"])();
app.use(_bodyParser["default"].urlencoded({
  extended: true
}));
app.use(_bodyParser["default"].json());
app.use((0, _cookieParser["default"])());
app.use((0, _morgan["default"])('combined'));
app.use(_jsend["default"].middleware);
app.use('/api/v1', _routes["default"]);
app.get('*', function (req, res) {
  return res.jsend.success('WayFarerApi');
});
var port = parseInt(process.env.PORT, 10) || 4000;
app.listen(port, function () {
  return console.log("Live at ".concat(port));
});