const jwt = require('jsonwebtoken');
const config = require('config');

// export middleware function which has req, res available to it - this validates the token
module.exports = function (req, res, next) {
	// get token from header
	const token = req.header('x-auth-token');

	// check if no token
	if (!token) {
		return res.status(401).json({ msg: 'No token, authorisation denied' });
	}

	// verify token and if verified can be used in any of our routes
	try {
		const decoded = jwt.verify(token, config.get('jwtSecret')); // decodes the token

		req.user = decoded.user;
		next(); // moves to next middleware
	} catch (err) {
		res.status(401).json({ msg: 'Token is not valid' });
	}
};
