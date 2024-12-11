const Department = require('../models/Department');

// Bölüm oluşturma
const createDepartment = async (req, res) => {
  const { name, faculty } = req.body;

  try {
    const department = new Department({ name, faculty });
    await department.save();
    res.status(201).json(department);
  } catch (err) {
    res.status(500).json({ message: 'Bölüm oluşturulamadı', error: err });
  }
};

// Tüm bölümleri listeleme
const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate('faculty');
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: 'Bölümler getirilemedi', error: err });
  }
};

// Bölüm detaylı gösterimi
const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate('faculty');
    if (!department) return res.status(404).json({ message: 'Bölüm bulunamadı' });
    res.json(department);
  } catch (err) {
    res.status(500).json({ message: 'Bölüm bulunamadı', error: err });
  }
};

// Bölüm güncelleme
const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!department) return res.status(404).json({ message: 'Bölüm bulunamadı' });
    res.json(department);
  } catch (err) {
    res.status(500).json({ message: 'Bölüm güncellenemedi', error: err });
  }
};

// Bölüm silme
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) return res.status(404).json({ message: 'Bölüm bulunamadı' });
    res.json({ message: 'Bölüm silindi' });
  } catch (err) {
    res.status(500).json({ message: 'Bölüm silinemedi', error: err });
  }
};

module.exports = { createDepartment, getAllDepartments, getDepartmentById, updateDepartment, deleteDepartment };
