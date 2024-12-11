import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const StudentDetails = () => {
  const { id } = useParams(); // Route'daki ID'yi al
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    facultyId: "",
    departmentId: "",
    isGraduated: false,
    graduationYear: "",
  });
  const [facultyName, setFacultyName] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Öğrenci bilgilerini API'den çek
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/students/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          facultyId: data.faculty?._id || "",
          departmentId: data.department?._id || "",
          isGraduated: data.isGraduated || false,
          graduationYear: data.graduationYear || "",
        });

        // Fakülte adı ve bölüm adı için API istekleri
        const [facultyResponse, departmentResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/faculties/${data.faculty?._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(
            `http://localhost:5000/api/departments/${data.department?._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
        ]);
        setFacultyName(facultyResponse.data.name);
        setDepartmentName(departmentResponse.data.name);
      } catch (error) {
        console.error("Öğrenci bilgileri alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id, token]);

  // Form verisi değişimlerini takip et
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Güncelleme isteği
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/students/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Öğrenci başarıyla güncellendi!");
      navigate("/adminpaneli/ogrenciler");
    } catch (error) {
      console.error("Güncelleme başarısız:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  if (loading) {
    return <div className="text-center">Yükleniyor...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">Öğrenci Güncelle</h2>
        <button
          onClick={() => navigate("/adminpaneli/ogrenciler")}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          Geri
        </button>
      </div>

      <form onSubmit={handleUpdate} className="bg-white shadow-md rounded-lg p-6">
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
            <input
              type="text"
              value={facultyName}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Bölüm
            </label>
            <input
              type="text"
              value={departmentName}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
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
          Güncelle
        </button>
      </form>
    </div>
  );
};

export default StudentDetails;
