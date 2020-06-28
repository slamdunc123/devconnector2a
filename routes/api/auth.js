const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// @router  GET api/auth - http://localhost:5000/api/auth
// @desc    Test route
// @access  Public
// router.get('/', (req, res) => res.send('Auth test route'));

// @router  GET api/auth - http://localhost:5000/api/auth
// @desc    Auth route
// @access  Public
// add auth (from middleware as a 2nd parameter)
router.get('/', auth, async (req, res) => {
	// res.send('Auth route')
	// get user data
	try {
		const user = await User.findById(req.user.id).select('-password');
		res.json(user);
	} catch (err) {
		console.log(err.message);
		res.status(500).send('Server error');
	}
});

// @router  POST api/auth - http://localhost:5000/api/auth
// @desc    Authenticate user and get token
// @access  Public
// to be able to send data (test in postman) using req.body, need this line in server.js  - app.use(express.json({ extended: false }));
router.post(
	'/',
	[
		// user validation using express-validator
		check('email', 'Please include a valid email').isEmail(),
		check('password', 'password is required').exists(),
	],
	async (req, res) => {
		console.log(req.body);
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password } = req.body;

		try {
			// check if user exists
			let user = await User.findOne({ email: email });

			if (!user) {
				return res.status(400).json({
					errors: [{ msg: 'Invalid credentials' }],
				});
			}

			// compare plain text password with encrypted password in the database
			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.status(400).json({
					errors: [{ msg: 'Invalid credentials' }],
				});
			}

			// return jsonwebtoken - get payload which is the user id
			// res.send('User registered');
			const payload = {
				user: {
					id: user.id, // mongoose uses abstraction so we don't need to use _id which is how mongoDB has it
				},
			};
			// sign the jwt token
			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{
					expiresIn: 360000, // token expiration - 3600 is 1 hour (use for production)
				},
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);

			// res.send('Users test route');
		} catch (err) {
			console.log(err.message);
			res.status(500).send('Server error');
		}
	}
);

module.exports = router;
