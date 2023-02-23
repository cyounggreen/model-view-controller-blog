// Express connection
const router = require('express').Router();

const { Comment } = require('../../models');

const withAuth = require('../../utils/auth');



// Gets all comments
router.get('/', (req, res) => {
  Comment.findAll({})
    .then((dataComment) => res.json(dataComment))
    .catch((err) => {
      res.status(500).json(err);
    });
});

// Posts a comment
router.post('/', withAuth, (req, res) => {
  if (req.session) {
    Comment.create({
      comment_text: req.body.comment_text,
      post_id: req.body.post_id,
      user_id: req.session.user_id,
    })
      .then((dataComment) => res.json(dataComment))
      .catch((err) => {
        res.status(400).json(err);
      });
  }
});

// Deletes a comment
router.delete('/:id', withAuth, (req, res) => {
  Comment.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dataComment) => {
      if (!dataComment) {
        res.status(404).json({ message: 'No comment found with this id' });
        return;
      }
      res.json(dataComment);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
