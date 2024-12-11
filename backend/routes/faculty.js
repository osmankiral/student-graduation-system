const express = require('express');
const router = express.Router();
const { createFaculty, getAllFaculties, getFacultyById, updateFaculty, deleteFaculty } = require('../controllers/facultyController');
const { adminMiddleware } = require('../middleware/adminMiddleware');

// Fakülte oluşturma
router.post('/', adminMiddleware, createFaculty);
// Tüm fakülteleri listeleme
router.get('/',adminMiddleware, getAllFaculties);
// Fakülteye göre detaylı gösterim
router.get('/:id',adminMiddleware, getFacultyById);
// Fakülteyi güncelleme
router.put('/:id', adminMiddleware, updateFaculty);
// Fakülteyi silme
router.delete('/:id', adminMiddleware, deleteFaculty);

module.exports = router;
