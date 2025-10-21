const checkUserStatus = (req, res, next) => {
  if (req.user.estado !== 'activo') {
    return res.status(403).json({ message: `Usuario ${req.user.estado}, acceso denegado` });
  }
  next();
};

module.exports = { checkUserStatus };
