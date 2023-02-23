// the router and the database
const router = require('express').Router();
const sequelize = require('../config/connection');

// Models
const { Post, User, Comment } = require('../models');

// Middleware that will redirect unauthenticated users to the login page
const withAuth = require('../utils/auth');

// Render logged-in user dashboard page
router.get('/', withAuth, async (req, res) => {
  try {
    // user posts rendered from DB
    const dataPost = await Post.findAll({
      where: { user_id: req.session.user_id },
      attributes: ['id', 'title', 'content', 'created_at'],
      include: [
        {
          model: Comment,
          attributes: [
            'id',
            'comment_text',
            'post_id',
            'user_id',
            'created_at',
          ],
          include: { model: User, attributes: ['username'] },
        },
        { model: User, attributes: ['username'] },
      ],
    });

    // serialize data before passing to template
    const posts = dataPost.map((post) => post.get({ plain: true }));
    res.render('dashboard', {
      posts,
      loggedIn: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// A route to edit a post
router.get('/edit/:id', withAuth, async (req, res) => {
  try {
    // Find one user
    const dataPost = await Post.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'title', 'content', 'created_at'],
      include: [
        {
          model: Comment,
          attributes: [
            'id',
            'comment_text',
            'post_id',
            'user_id',
            'created_at',
          ],
          include: { model: User, attributes: ['username'] },
        },
        { model: User, attributes: ['username'] },
      ],
    });
    if (!dataPost) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }

    postNewData = dataPost.get({ plain: true });
    res.render('edit-post', {
      postNewData,
      loggedIn: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/new', (req, res) => {
  res.render('new-post', {
    layout: 'dashboard',
  });
});

module.exports = router;
