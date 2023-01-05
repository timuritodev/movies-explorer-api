const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Авторизация необходима'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    const { JWT_SALT } = req.app.get('config');
    payload = jwt.verify(token, JWT_SALT);
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
