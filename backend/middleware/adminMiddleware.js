// middleware/adminMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const adminMiddleware = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // Token başlıkta taşınıyor.
  if (!token) return res.status(401).json({ message: 'Token bulunamadı' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // 'secretKey' yerine çevresel değişken kullanılabilir.
    const user = await User.findById(decoded.id);
    
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Yetkiniz yok' });
    }

    req.user = user; // Kullanıcı bilgilerini request'e ekliyoruz.
    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: 'Geçersiz token' });
  }
};

module.exports = { adminMiddleware };
