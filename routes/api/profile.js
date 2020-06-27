const express = require('express');
const router = express.Router();

// @router  GET api/profile - http://localhost:5000/api/profile
// @desc    Test route
// @access  Public
router.get('/', (req, res) => res.send('Profile test route'));

module.exports = router;
