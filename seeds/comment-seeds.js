const { Comment } = require('../models');

const dataComment = [
  {
    comment_text: 'I would love to use a dog app!',
    user_id: 1,
    post_id: 1,
  },
  {
    comment_text:
      'Haha, I am also a little lost!',
    user_id: 2,
    post_id: 2,
  },
  {
    comment_text: 'So cute!',
    user_id: 3,
    post_id: 3,
  },
];

const commentSeeds = () => Comment.bulkCreate(dataComment);

module.exports = commentSeeds;
