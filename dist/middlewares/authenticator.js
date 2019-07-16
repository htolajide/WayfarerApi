

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

const _jsonwebtoken = _interopRequireDefault(require('jsonwebtoken'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const _default = function _default(req, res, next) {
  const { token } = req.cookies;
  if (!token) return res.jsend.error('Unauthenticated!');

  try {
    const user = _jsonwebtoken.default.decode(token, process.env.SECRET);

    req.user = user;
    return next();
  } catch (error) {
    return res.jsend.error({
      message: 'authentication failed',
      data: error,
    });
  }
};

exports.default = _default;
