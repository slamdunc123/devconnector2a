const express = require('express');
const router = express.Router();

// @router  GET api/auth - http://localhost:5000/api/auth
// @desc    Test route
// @access  Public
router.get('/', (req, res) => res.send('Auth test route'));

module.exports = router;
