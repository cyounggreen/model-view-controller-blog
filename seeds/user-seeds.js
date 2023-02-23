const { User } = require('../models');

const dataUser = [
  {
    username: 'jane',
    password: 'password12345',
    user_id: 1,
  },
  {
    username: 'jill',
    password: 'password123456',
    user_id: 2,
  },
  {
    username: 'harley',
    password: 'password1234567',
    user_id: 3,
  },
];

const userSeeds = () => User.bulkCreate(dataUser);

module.exports = userSeeds;
