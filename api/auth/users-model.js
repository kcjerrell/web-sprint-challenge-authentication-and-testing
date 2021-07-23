const db = require('../../data/dbConfig')

async function getUser(username) {
	const result = await db('users').where({ username }).select().first();

	return result;
}

async function addUser(user) {
	const result = await db('users').insert(user);

	if (result)
		return await getUser(user.username);
	else
		return null;
}

module.exports = { getUser, addUser };
