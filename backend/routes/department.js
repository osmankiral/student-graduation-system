const express = require('express');
const router = express.Router();
const { createDepartment, getAllDepartments, getDepartmentById, updateDepartment, deleteDepartment } = require('../controllers/departmentController');
const { adminMiddleware } = require('../middleware/adminMiddleware');

// Bölüm oluşturma
router.post('/', adminMiddleware, createDepartment);
// Tüm bölümleri listeleme
router.get('/',adminMiddleware, getAllDepartments);
// Bölüm detaylı gösterimi
router.get('/:id',adminMiddleware, getDepartmentById);
// Bölüm güncelleme
router.put('/:id', adminMiddleware, updateDepartment);
// Bölüm silme
router.delete('/:id', adminMiddleware, deleteDepartment);

module.exports = router;
