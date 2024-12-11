const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  isGraduated: {
    type: Boolean,
    required: true
  },
  graduationYear: {
    type: Number,
    required: function() {
      return this.isGraduated; // Mezuniyet yılı, sadece mezun ise gereklidir
    }
  }
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;