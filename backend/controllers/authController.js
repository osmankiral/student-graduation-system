const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');


const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Kullanıcı bulunamadı' });
    
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    
    if (!isMatch) return res.status(400).json({ message: 'Yanlış şifre' });

    // Token oluşturulurken rol bilgisi de ekleniyor
    const token = jwt.sign(
      { id: user._id, role: user.role },  // Kullanıcının rolünü ekliyoruz
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Kayıt işlemi (register)
const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Kullanıcı adı zaten var mı kontrol et
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Kullanıcı adı zaten mevcut' });

    // Yeni kullanıcı oluştur
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });

    // Yeni kullanıcıyı veritabanına kaydet
    await newUser.save();

    // Kullanıcı başarıyla kaydedildiğinde, token oluştur
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

module.exports = { login, register };
