const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Routes

// Get all posts

router.get('/', async (req, res) => {
  try {
    const dataPost = await Post.findAll({
      attributes: ['id', 'title', 'content', 'created_at'],
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          attributes: [
            'id',
            'comment_text',
            'post_id',
            'user_id',
            'created_at',
          ],
          include: {
            model: User,
            attributes: ['username'],
          },
        },
      ],
    });

    // Serialize data so the template can read it
    const posts = (dataPost) => res.json(dataPost.reverse());
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get a single post by id
router.get('/:id', async (req, res) => {
  try {
    const dataPost = await Post.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'content', 'title', 'created_at'],
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          attributes: [
            'id',
            'comment_text',
            'post_id',
            'user_id',
            'created_at',
          ],
          include: {
            model: User,
            attributes: ['username'],
          },
        },
      ],
    });
    if (!dataPost) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }
    res.json(dataPost);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Create a new post with Auth
router.post('/', withAuth, (req, res) => {
  console.log('error');
  Post.create({
    title: req.body.title,
    content: req.body.content,
    user_id: req.session.user_id,
  })
    .then((dataPost) => {
      console.log(dataPost, 'post-creation');
      res.json(dataPost);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});
// Update a post's title or text
router.put('/:id', withAuth, (req, res) => {
  Post.update({
    where: {
      id: req.params.id,
    },
  })
    .then((dataPost) => {
      if (!dataPost) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dataPost);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Delete a post
router.delete('/:id', withAuth, (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dataPost) => {
      if (!dataPost) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dataPost);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
