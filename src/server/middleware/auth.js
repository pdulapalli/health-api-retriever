module.exports = async (req, res, next) => {
  try {
    const { token } = req;
    if (!token) {
      throw new Error('No token supplied');
    }

    next();
    return;
  } catch (err) {
    res.status(401).json({
      error: 'Invalid token',
    });
  }
};
