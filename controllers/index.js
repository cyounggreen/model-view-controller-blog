// Dependencies
// Server connection
const router = require('express').Router();

// API routes folder
const routeApi = require('./api');
// Homepage routes
const routeHome = require('./home-routes');
// Dashboard Routes
const routeDashboard = require('./dashboard-routes');

// Define the path for the home page
router.use('/', routeHome);
// Define the path for the server for the API routes
router.use('/api', routeApi);
// Define the path for the dashboard
router.use('/dashboard', routeDashboard);

// Define a catch-all route for any resource that doesn't exist
router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;
