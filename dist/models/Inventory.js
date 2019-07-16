

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var Inventory = {
  create: function create(inventory) {
    return Inventory.list.push(inventory);
  },
  findAll: function findAll(userId) {
    return Inventory.list.filter(inventory => inventory.userId === userId);
  },
  findOne: function findOne(inventoryId) {
    return Inventory.list.find(inventory => inventory.id === inventoryId);
  },
  list: [],
};
const _default = Inventory;
exports.default = _default;
