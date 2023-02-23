const router = require('express').Router();
const { Post, User, Comment } = require('../models');

// Render Homepage
router.get('/', async (req, res) => {
  try {
    // Query configuration
    // Include the following from the Post table
    const dataPost = await Post.findAll({
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
          // Order the posts from most recent to least
          order: [['created_at', 'DESC']],

          // From the User table include the post creator's username
          // From the Comment table include comments
          include: { model: User, attributes: ['username'] },
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
    // Create an array for the posts
    const posts = dataPost.map((post) => post.get({ plain: true }));

    // Pass the posts into the homepage template
    res.render('homepage', {
      posts,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//LOGIN
router.get('/login', (req, res) => {
  // If a session exists, redirect the request to the homepage
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

//SIGNUP
router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('signup');
});

//POST
router.get('/post/:id', async (req, res) => {
  try {
    const dataPost = await Post.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'content', 'title', 'created_at'],
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
        {
          model: Comment,
          attributes: [
            'id',
            'comment_text',
            'post_id',
            'user_id',
            'created_at',
          ],
        },
      ],
    });

    // If no post by that id exists, return error
    if (!dataPost) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }
    // Serialize post data
    const post = dataPost.get({ plain: true });

    //Past data
    res.render('single-post', {
      post,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
