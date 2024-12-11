// routes/user.js
const express = require('express');
const { adminMiddleware } = require('../middleware/adminMiddleware');
const router = express.Router();
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');

// Kullanıcıları sadece adminler görebilir
router.get('/', adminMiddleware, getAllUsers);


// Kullanıcıyı ID ile getiren rota
router.get('/:id',adminMiddleware, getUserById);

// Kullanıcı oluşturma rotası
router.post('/', createUser);

// Kullanıcıyı güncelleyen rota
router.put('/:id', updateUser);

// Kullanıcıyı silen rota
router.delete('/:id',adminMiddleware, deleteUser);

module.exports = router;
