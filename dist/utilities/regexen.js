

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.descriptionRegex = exports.passwordRegex = exports.numberRegex = exports.emailRegex = void 0;
const emailRegex = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{3})+$/;
exports.emailRegex = emailRegex;
const numberRegex = /^\d$/;
exports.numberRegex = numberRegex;
const passwordRegex = /^.{6,}$/;
exports.passwordRegex = passwordRegex;
const descriptionRegex = /[a-zA-Z .]{20,}/;
exports.descriptionRegex = descriptionRegex;
