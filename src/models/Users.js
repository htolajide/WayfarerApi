import User from '../database/queryUser';

const Users = {
  create: user => Users.list.push(user),
  list: [User.getUserByEmail],
};

export default Users;
