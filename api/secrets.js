if (!process.env.JWT_SECRET) {
	console.warn('please configure your token secret in the environment variables!')
}

const JWT_SECRET = process.env.JWT_SECRET || 'my not so secret backup secret, clear as day in the repo source'

module.exports = { JWT_SECRET };
