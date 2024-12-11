const mongoose = require('mongoose');
const Faculty = require('../models/Faculty');

// Fakülte oluşturma
const createFaculty = async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: 'Geçerli bir fakülte adı gerekli' });
  }

  try {
    const faculty = new Faculty({ name });
    await faculty.save();
    res.status(201).json(faculty);
  } catch (err) {
    console.error('Fakülte oluşturma hatası:', err);
    res.status(500).json({ message: 'Fakülte oluşturulamadı', error: err });
  }
};

// Tüm fakülteleri listeleme
const getAllFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find(); 
    res.json(faculties);
  } catch (err) {
    console.error('Fakülteler getirilemedi:', err);
    res.status(500).json({ message: 'Fakülteler getirilemedi', error: err });
  }
};

// Fakülteye göre detaylı gösterim
const getFacultyById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Geçersiz ID' });
  }

  try {
    const faculty = await Faculty.findById(id);
    if (!faculty) return res.status(404).json({ message: 'Fakülte bulunamadı' });
    res.json(faculty);
  } catch (err) {
    console.error('Fakülte detay hatası:', err);
    res.status(500).json({ message: 'Fakülte getirilemedi', error: err });
  }
};

// Fakülteyi güncelleme
const updateFaculty = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Geçersiz ID' });
  }

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: 'Geçerli bir fakülte adı gerekli' });
  }

  try {
    const faculty = await Faculty.findByIdAndUpdate(id, { name }, { new: true });
    if (!faculty) return res.status(404).json({ message: 'Fakülte bulunamadı' });
    res.json(faculty);
  } catch (err) {
    console.error('Fakülte güncelleme hatası:', err);
    res.status(500).json({ message: 'Fakülte güncellenemedi', error: err });
  }
};

// Fakülteyi silme
const deleteFaculty = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Geçersiz ID' });
  }

  try {
    const faculty = await Faculty.findByIdAndDelete(id);
    if (!faculty) return res.status(404).json({ message: 'Fakülte bulunamadı' });
    res.json({ message: 'Fakülte başarıyla silindi' });
  } catch (err) {
    console.error('Fakülte silme hatası:', err);
    res.status(500).json({ message: 'Fakülte silinemedi', error: err });
  }
};

module.exports = {
  createFaculty,
  getAllFaculties,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
};
