const express = require('express');
const router = express.Router();

// @router  GET api/users - http://localhost:5000/api/users
// @desc    Test route
// @access  Public
router.get('/', (req, res) => res.send('Users test route'));

module.exports = router;
