"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var Inventory = {
  create: function create(inventory) {
    return Inventory.list.push(inventory);
  },
  findAll: function findAll(userId) {
    return Inventory.list.filter(function (inventory) {
      return inventory.userId === userId;
    });
  },
  findOne: function findOne(inventoryId) {
    return Inventory.list.find(function (inventory) {
      return inventory.id === inventoryId;
    });
  },
  list: []
};
var _default = Inventory;
exports["default"] = _default;