

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

const _models = _interopRequireDefault(require('../models'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { Inventory } = _models.default;
const _default = {
  create: function create(req, res) {
    const _req$body = req.body;
    const { category } = _req$body;
    const { name } = _req$body;
    const { description } = _req$body;
    const { userId } = req.user;
    const inventory = {
      id: Inventory.list.length + 1,
      category,
      name,
      description,
      userId,
    }; // persist inventory to database

    Inventory.create(inventory);
    return res.jsend.success(inventory);
  },
  findAll: function findAll(req, res) {
    const { userId } = req.user;
    const listOfInventory = Inventory.findAll(userId);
    return res.jsend.success(listOfInventory);
  },
  findOne: function findOne(req, res) {
    const { inventoryId } = req.params;
    const { userId } = req.user;
    const inventory = Inventory.findOne(+inventoryId);
    if (!inventory) return res.jsend.error('Inventory does not exist');
    if (inventory.userId !== userId) return res.jsend.error('You cannot access this inventory');
    return res.jsend.success(inventory);
  },
};
exports.default = _default;
