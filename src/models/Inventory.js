const Inventory = {
  create: inventory => Inventory.list.push(inventory),
  findAll: userId => Inventory.list.filter(inventory => inventory.userId === userId),
  findOne: inventoryId => Inventory.list.find(inventory => inventory.id === inventoryId),
  list: []
};

export default Inventory;
