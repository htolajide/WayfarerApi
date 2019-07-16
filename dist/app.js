

require('@babel/polyfill');

const _bodyParser = _interopRequireDefault(require('body-parser'));

const _cookieParser = _interopRequireDefault(require('cookie-parser'));

const _dotenv = _interopRequireDefault(require('dotenv'));

const _express = _interopRequireDefault(require('express'));

const _jsend = _interopRequireDefault(require('jsend'));

const _morgan = _interopRequireDefault(require('morgan'));

const _routes = _interopRequireDefault(require('./routes'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

const app = (0, _express.default)();
app.use(_bodyParser.default.urlencoded({
  extended: true,
}));
app.use(_bodyParser.default.json());
app.use((0, _cookieParser.default)());
app.use((0, _morgan.default)('combined'));
app.use(_jsend.default.middleware);
app.use('/api/v1', _routes.default);
app.get('*', (req, res) => res.jsend.success('WayFarerApi'));
const port = parseInt(process.env.PORT, 10) || 4000;
app.listen(port, () => console.log('Live at '.concat(port)));
