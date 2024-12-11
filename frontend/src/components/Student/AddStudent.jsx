import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddStudent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    facultyId: "",
    departmentId: "",
    isGraduated: false,
    graduationYear: "",
  });
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const token = localStorage.getItem("token");

  // Fakülte ve departman verilerini çek
  useEffect(() => {
    const fetchFacultiesAndDepartments = async () => {
      try {
        const [facultyResponse, departmentResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/faculties", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/departments", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setFaculties(facultyResponse.data);
        setDepartments(departmentResponse.data);
      } catch (error) {
        console.error("Veriler alınamadı:", error);
      }
    };

    fetchFacultiesAndDepartments();
  }, [token]);

  // Fakülte seçildiğinde departmanları filtrele
  useEffect(() => {
    if (formData.facultyId) {
      const filtered = departments.filter(
        (dept) => dept.faculty._id === formData.facultyId
      );
      setFilteredDepartments(filtered);
    } else {
      setFilteredDepartments([]);
    }
  }, [formData.facultyId, departments]);

  // Form verisi değişimlerini takip et
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Yeni öğrenci ekleme isteği
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/students/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Öğrenci başarıyla eklendi!");
      navigate("/adminpaneli/ogrenciler");
    } catch (error) {
      console.error("Ekleme başarısız:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">Öğrenci Ekle</h2>
        <button
          onClick={() => navigate("/adminpaneli/ogrenciler")}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          Geri
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Ad
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Soyad
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Fakülte
            </label>
            <select
              name="facultyId"
              value={formData.facultyId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Fakülte Seç</option>
              {faculties.map((faculty) => (
                <option key={faculty._id} value={faculty._id}>
                  {faculty.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Bölüm
            </label>
            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Bölüm Seç</option>
              {filteredDepartments.map((department) => (
                <option key={department._id} value={department._id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Mezuniyet Durumu
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isGraduated"
                checked={formData.isGraduated}
                onChange={handleChange}
                className="mr-2"
              />
              Mezun
            </label>
          </div>
        </div>

        {formData.isGraduated && (
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Mezuniyet Yılı
            </label>
            <input
              type="number"
              name="graduationYear"
              value={formData.graduationYear}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Ekle
        </button>
      </form>
    </div>
  );
};

export default AddStudent;
