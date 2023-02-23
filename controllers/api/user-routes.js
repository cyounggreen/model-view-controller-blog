
// Express.js connection
const router = require('express').Router();

// User, Post, Comment models
const { User, Post, Comment } = require('../../models');

// Express Session for the session data
const session = require('express-session');

// Authorization Helper
const withAuth = require('../../utils/auth');

// Sequelize store to save the session so the user can remain logged in
const SequelizeStore = require('connect-session-sequelize')(session.Store);

//ROUTES

// GET all users
router.get('/', (req, res) => {
  // Accesses User model and runs .findAll() method
  User.findAll({
    // Excludes password when the data is sent back
    attributes: { exclude: ['password'] },
  })
    // Returns data im JSON format
    .then((dbDataUser) => res.json(dbDataUser))
    // If server error, return 500 error
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Gets one user by the id
router.get('/:id', (req, res) => {
  User.findOne({
    attributes: { exclude: ['password'] },
    // Uses id as the parameter request
    where: {
      id: req.params.id,
    },
    // Include the posts the user has created and the posts a user commented on
    include: [
      {
        model: Post,
        attributes: ['id', 'title', 'content', 'created_at'],
      },
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: Post,
          attributes: ['title'],
        },
      },
    ],
  })
    .then((dataUser) => {
      if (!dataUser) {
        // If no user is found, return error
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      // Else, return the data for requested user
      res.json(dataUser);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// Add a new user
router.post('/', (req, res) => {
  User.create({
    username: req.body.username,
    password: req.body.password,
  })

    .then((dataUser) => {
      req.session.save(() => {
        req.session.user_id = dataUser.id;
        req.session.username = dataUser.username;
        req.session.loggedIn = true;

        res.json(dataUser);
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// Login route for a user
router.post('/login', async (req, res) => {
  try {
    const dataUser = await User.findOne({
      where: { username: req.body.username },
    });

    if (!dataUser) {
      res.status(400).json({ message: 'No user with that username!' });
      return;
    }
    // Call the instance method as defined in the User model
    const validPassword = dataUser.checkPassword(req.body.password);

    // if password is invalid (method returns false), return error
    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password!' });
      return;
    }
    req.session.save(() => {
      // Declare session variables
      req.session.user_id = dataUser.id;
      req.session.username = dataUser.username;
      req.session.loggedIn = true;

      res.json({ user: dataUser, message: 'You are now logged in!' });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Logs out an existing user
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      // 204 - request has succeeded
      res.status(204).end();
    });
  } else {
    // if there is no session
    res.status(404).end();
  }
});

// Update an existing user
router.put('/:id', withAuth, (req, res) => {
  User.update(req.body, {
    // Hook to hash only the password
    individualHooks: true,
    // Use the id as the parameter for the individual user to be updated
    where: {
      id: req.params.id,
    },
  })
    .then((dataUser) => {
      if (!dataUser[0]) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dataUser);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// Delete an existing user
router.delete('/:id', (req, res) => {
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dataUser) => {
      if (!dataUser) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dataUser);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
