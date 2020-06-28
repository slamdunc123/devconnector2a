const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
// bring in the user model
const User = require('../../models/User');

// @router  GET api/users - http://localhost:5000/api/users
// @desc    Test route
// @access  Public
router.get('/', (req, res) => res.send('Users test route'));

// @router  POST api/users - http://localhost:5000/api/users
// @desc    Register user
// @access  Public
// to be able to send data (test in postman) using req.body, need this line in server.js  - app.use(express.json({ extended: false }));
router.post(
	'/',
	[
		// user validation using express-validator
		check('name', 'Name is required').not().isEmpty(),
		check('email', 'Please include a valid email').isEmail(),
		check(
			'password',
			'Please enter a password with 6 or more characters'
		).isLength({ min: 6 }),
	],
	async (req, res) => {
		console.log(req.body);
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, password } = req.body;

		try {
			// check if user exists
			let user = await User.findOne({ email: email });

			if (user) {
				return res.status(400).json({
					errors: [{ msg: 'User already exists' }],
				});
			}

			// get user's gravatar
			const avatar = gravatar.url(email, {
				s: '200', // default size
				r: 'pg', // default rating
				d: 'mm', // default image
			});

			// create user instance
			user = new User({
				name,
				email,
				avatar,
				password,
			});

			// encrypt password using bcryptjs and save user
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);
			await user.save();

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
