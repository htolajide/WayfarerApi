"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  checkForEmptyFields: function checkForEmptyFields(field, value) {
    if (!value || !value.trim()) return ["".concat(field, " is required")];
    return [];
  },
  checkPatternedFields: function checkPatternedFields(field, value, regex) {
    if (!regex.test(value)) return ["".concat(field, " is invalid")];
    return [];
  }
};
exports["default"] = _default;