import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import models from '../models';

const { Users } = models;

export default {
  signup: async (req, res) => {
    const {
      firstname, lastname, email, password
    } = req.body;

    // check for existence
    const foundUser = Users.list.find(user => user.email === email);
    if (foundUser) return res.jsend.fail('Email address already exists.');

    const user = {
      id: Users.list.length + 1,
      firstname,
      lastname,
      email,
      password: await bcrypt.hash(password, 10)
    };

    // persist user to database
    Users.create(user);

    // sign jwt and wrap in a cookie
    const token = jwt.sign({ userId: user.id }, process.env.SECRET);
    res.cookie('token', token, { expires: new Date(Date.now() + 3600000), httpOnly: true });

    return res.jsend.success(token);
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    const foundUser = Users.list.find(user => user.email === email);
    if (!foundUser) return res.jsend.fail('user does not exist.');
    
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) return res.jsend.fail('Login failed!');

    // sign jwt and wrap in a cookie
    const token = jwt.sign({ userId: foundUser.id }, process.env.SECRET);
    res.cookie('token', token, { expires: new Date(Date.now() + 3600000), httpOnly: true });

    return res.jsend.success(token);
  }
};
