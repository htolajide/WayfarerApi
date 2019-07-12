"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _models = _interopRequireDefault(require("../models"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Inventory = _models["default"].Inventory;
var _default = {
  create: function create(req, res) {
    var _req$body = req.body,
        category = _req$body.category,
        name = _req$body.name,
        description = _req$body.description,
        userId = req.user.userId;
    var inventory = {
      id: Inventory.list.length + 1,
      category: category,
      name: name,
      description: description,
      userId: userId
    }; // persist inventory to database

    Inventory.create(inventory);
    return res.jsend.success(inventory);
  },
  findAll: function findAll(req, res) {
    var userId = req.user.userId;
    var listOfInventory = Inventory.findAll(userId);
    return res.jsend.success(listOfInventory);
  },
  findOne: function findOne(req, res) {
    var inventoryId = req.params.inventoryId,
        userId = req.user.userId;
    var inventory = Inventory.findOne(+inventoryId);
    if (!inventory) return res.jsend.error('Inventory does not exist');
    if (inventory.userId !== userId) return res.jsend.error('You cannot access this inventory');
    return res.jsend.success(inventory);
  }
};
exports["default"] = _default;