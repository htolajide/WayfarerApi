import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const { token } = req.cookies;
  if (!token) return res.jsend.error('You are not authorised');

  try {
    const user = jwt.decode(token, process.env.SECRET);
    req.user = user;
    return next();
  } catch (error) {
    return res.jsend.error({
      message: 'Your authentication failed',
      data: error,
    });
  }
};
