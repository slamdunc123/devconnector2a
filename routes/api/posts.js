const express = require('express');
const router = express.Router();

// @router  GET api/posts - http://localhost:5000/api/posts
// @desc    Test route
// @access  Public
router.get('/', (req, res) => res.send('Posts test route'));

module.exports = router;
