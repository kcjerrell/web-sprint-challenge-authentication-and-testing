const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../secrets');

module.exports = function (user) {
	const payload = {
		user_id: user.user_id,
		username: user.username,
	}

	/** @type {jwt.SignOptions} */
	const options = {
		expiresIn: '1d',
	}

	return jwt.sign(payload, JWT_SECRET, options);
}
