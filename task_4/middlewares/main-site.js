module.exports = async (req, res, next) => {
  res.locals.user = req.session.user;
  next();
};
