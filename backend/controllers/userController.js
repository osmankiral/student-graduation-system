// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Tüm kullanıcıları getiren fonksiyon
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Kullanıcıyı ID ile getiren fonksiyon
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Kullanıcı oluşturma fonksiyonu
const createUser = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Kullanıcı adı zaten varsa
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Bu kullanıcı adı zaten alınmış' });
    }

    // Yeni kullanıcı oluşturma
    const newUser = new User({
      username,
      password,
      role,
    });

    // Kullanıcıyı kaydetme
    await newUser.save();

    res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu', user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Kullanıcıyı güncelleyen fonksiyon
const updateUser = async (req, res) => {
  const { password } = req.body;

  try {
    // Eğer şifre güncellenmişse, şifreyi hash'le
    if (password) {
      req.body.password = await bcrypt.hash(password, 10); // Şifreyi hash'le
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Kullanıcıyı silen fonksiyon
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    res.json({ message: 'Kullanıcı başarıyla silindi' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
