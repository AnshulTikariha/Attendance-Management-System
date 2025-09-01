const jwt = require('jsonwebtoken');

function authenticateJWT(req, res, next) {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Missing or invalid Authorization header' });
	}
	const token = authHeader.split(' ')[1];
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		req.user = payload;
		return next();
	} catch (err) {
		return res.status(401).json({ message: 'Invalid token' });
	}
}

function authorizeRoles(...allowedRoles) {
	return (req, res, next) => {
		if (!req.user || !allowedRoles.includes(req.user.role)) {
			return res.status(403).json({ message: 'Forbidden' });
		}
		return next();
	};
}

module.exports = { authenticateJWT, authorizeRoles };



