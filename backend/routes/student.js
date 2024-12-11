
const express = require('express');
const router = express.Router();
const {
  addStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');
const { adminMiddleware } = require('../middleware/adminMiddleware');

// Öğrenci ekleme
router.post('/add',adminMiddleware, addStudent);

// Tüm öğrencileri listeleme
router.get('/',adminMiddleware, getStudents);

// Öğrenci detaylı listeleme
router.get('/:id',adminMiddleware, getStudent);

// Öğrenci güncelleme
router.put('/:id',adminMiddleware, updateStudent);

// Öğrenci silme
router.delete('/:id',adminMiddleware, deleteStudent);

module.exports = router;
