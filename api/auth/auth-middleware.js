const Users = require('./users-model');

/** @type {express.RequestHandler} */
const validateUser = (req, res, next) => {
	const { username, password } = req.body;

	if (!username || typeof username !== 'string' || username.trim().length === 0
		|| !password || typeof password !== 'string' || password.length === 0) {
		return next([400, "username and password are required"])
	}
	else {
		req.postedUser = { username: username.trim(), password };
		next();
	}
};

/** @type {express.RequestHandler} */
const verifyUserExists = async (req, res, next) => {
	const user = await Users.getUser(req.postedUser.username);

	if (user) {
		req.user = user;
		return next();
	}
	else {
		next([400, "invalid credentials"]);
	}
};


/** @type {express.RequestHandler} */
const verifyUsernameAvailable = async (req, res, next) => {
	const user = await Users.getUser(req.postedUser.username);

	if (user) {
		return next([400, "username taken"]);
	}
	else {
		next();
	}
};

module.exports = { validateUser, verifyUserExists, verifyUsernameAvailable };
