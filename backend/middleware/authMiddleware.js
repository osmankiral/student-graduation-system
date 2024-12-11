const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Kullanıcı modelinizi import edin

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) return res.status(401).json({ message: 'Token gerekli' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Token'ı doğrula
    const user = await User.findById(decoded.id); // Kullanıcıyı bul
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

    req.user = user; // Kullanıcı bilgisini request'e ekle
    next(); // Rotaya geçiş yap
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Geçersiz token' });
  }
};

module.exports = authMiddleware;
