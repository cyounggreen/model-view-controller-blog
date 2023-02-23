const { Post } = require('../models');

const dataPost = [
  {
    title: 'Cute Dog',
    content:
      'Working on something to make an app for dog lovers!',
    user_id: 1,
  },
  {
    title: 'Any ideas?',
    content:
      'Trying to get this blog to work. Any ideas?',
    user_id: 2,
  },
  {
    title: 'Pet Match',
    content:
      'Trying to make an app that matches pets with possible owners!',
    user_id: 3,
  },
];

const postSeeds = () => Post.bulkCreate(dataPost);

module.exports = postSeeds;
