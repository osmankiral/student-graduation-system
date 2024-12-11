const mongoose = require('mongoose');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Department = require('../models/Department');

// Öğrenci ekleme
const addStudent = async (req, res) => {
  const { firstName, lastName, facultyId, departmentId, isGraduated, graduationYear } = req.body;
console.log(req.body);

  if (!firstName || !lastName || !facultyId || !departmentId) {
    return res.status(400).json({ message: 'Zorunlu alanlar eksik' });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(facultyId) || !mongoose.Types.ObjectId.isValid(departmentId)) {
      return res.status(400).json({ message: 'Geçersiz fakülte veya bölüm ID' });
    }

    const faculty = await Faculty.findById(facultyId);
    const department = await Department.findById(departmentId);

    if (!faculty) return res.status(404).json({ message: 'Fakülte bulunamadı' });
    if (!department) return res.status(404).json({ message: 'Bölüm bulunamadı' });

    if (isGraduated && !graduationYear) {
      return res.status(400).json({ message: 'Mezuniyet yılı gereklidir' });
    }

    const newStudent = new Student({
      firstName,
      lastName,
      faculty: facultyId,
      department: departmentId,
      isGraduated,
      graduationYear: isGraduated ? graduationYear : null,
    });

    await newStudent.save();
    res.status(201).json({ message: 'Öğrenci başarıyla eklendi', student: newStudent });
  } catch (err) {
    console.error('Öğrenci ekleme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Öğrencileri listeleme
const getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('faculty', 'name')
      .populate('department', 'name');
    res.status(200).json(students);
  } catch (err) {
    console.error('Öğrenciler listelenemedi:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Öğrenci detaylı listeleme
const getStudent = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Geçersiz öğrenci ID' });
  }

  try {
    const student = await Student.findById(id)
      .populate('faculty', 'name')
      .populate('department', 'name');
    if (!student) return res.status(404).json({ message: 'Öğrenci bulunamadı' });
    res.status(200).json(student);
  } catch (err) {
    console.error('Öğrenci detay hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Öğrenci güncelleme
const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, facultyId, departmentId, isGraduated, graduationYear } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Geçersiz öğrenci ID' });
  }

  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        faculty: facultyId,
        department: departmentId,
        isGraduated,
        graduationYear: isGraduated ? graduationYear : null,
      },
      { new: true }
    ).populate('faculty', 'name').populate('department', 'name');

    if (!updatedStudent) return res.status(404).json({ message: 'Öğrenci bulunamadı' });

    res.status(200).json({ message: 'Öğrenci başarıyla güncellendi', student: updatedStudent });
  } catch (err) {
    console.error('Öğrenci güncelleme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Öğrenci silme
const deleteStudent = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Geçersiz öğrenci ID' });
  }

  try {
    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent) return res.status(404).json({ message: 'Öğrenci bulunamadı' });
    res.status(200).json({ message: 'Öğrenci başarıyla silindi' });
  } catch (err) {
    console.error('Öğrenci silme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

module.exports = {
  addStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
};
