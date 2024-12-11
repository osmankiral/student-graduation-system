import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddDepartment = () => {
  const [formData, setFormData] = useState({
    name: "", // Departman adı
    faculty: {}, // Fakülte objesi
  });
  const [faculties, setFaculties] = useState([]); // Fakülteler
  const [errorMessage, setErrorMessage] = useState(""); // Hata mesajı
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fakülteleri almak için useEffect kullanımı
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/faculties", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFaculties(response.data); // Fakülteleri state'e set et
      } catch (error) {
        console.error("Fakülteler alınırken hata oluştu", error);
      }
    };

    fetchFaculties();
  }, [token]);

  // Form verisi değişimlerini takip et
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrorMessage(""); // Formda bir değişiklik olduğunda hata mesajını temizle
  };

  // Fakülte seçimi değiştiğinde, fakülteyi state'e ekle
  const handleFacultyChange = (e) => {
    const selectedFaculty = faculties.find(faculty => faculty._id === e.target.value);
    setFormData((prevState) => ({
      ...prevState,
      faculty: selectedFaculty, // Fakülte objesini ekle
    }));
  };

  // Departman ekleme isteği
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form verisi: ", formData);  // Form verisini kontrol et

    // Fakülte seçimi yapılmadıysa, kullanıcıyı uyar
    if (!formData.faculty || !formData.faculty._id) {
      setErrorMessage("Fakülte seçimi yapılmadı.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/departments", // Departmanı eklemek için API endpoint
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Departman başarıyla eklendi!");
      navigate("/adminpaneli/fakulteler"); // Fakülteler sayfasına yönlendir
    } catch (error) {
      console.error("Ekleme başarısız:", error);
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message); // Backend'den gelen hata mesajını göster
      } else {
        setErrorMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">Departman Ekle</h2>
        <button
          onClick={() => navigate("/adminpaneli/fakulteler")}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          Geri
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Departman Adı
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Fakülte Seçin
          </label>
          <select
            name="faculty"
            value={formData.faculty._id || ""}
            onChange={handleFacultyChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Fakülte Seçin</option>
            {faculties.map((faculty) => (
              <option key={faculty._id} value={faculty._id}>
                {faculty.name}
              </option>
            ))}
          </select>
        </div>

        {errorMessage && (
          <div className="mb-4 text-red-500">{errorMessage}</div> // Hata mesajı gösterimi
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

export default AddDepartment;
