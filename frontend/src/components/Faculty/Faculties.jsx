import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Yönlendirme için kullanıyoruz

const Faculties = () => {
  const [faculties, setFaculties] = useState([]); // Fakülteler
  const [departments, setDepartments] = useState([]); // Departmanlar
  const [selectedFaculty, setSelectedFaculty] = useState(null); // Seçilen fakülte
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate(); // Yönlendirme için hook

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

  // Fakülteye tıklandığında departmanları almak
  const handleFacultyClick = async (facultyId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/departments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Seçilen fakülteye ait departmanları filtrele
      const filteredDepartments = response.data.filter(
        (dept) => dept.faculty._id === facultyId
      );
      setDepartments(filteredDepartments); // Departmanları state'e set et
      setSelectedFaculty(facultyId); // Seçilen fakülteyi state'e set et
    } catch (error) {
      console.error("Departmanlar alınırken hata oluştu", error);
    }
  };

  // Fakülte Ekle butonuna tıklama işlemi
  const handleAddFacultyClick = () => {
    navigate("/adminpaneli/fakulteler/ekle"); // Fakülte ekleme sayfasına yönlendir
  };

  // Departman Ekle butonuna tıklama işlemi
  const handleAddDepartmentClick = () => {
    navigate("/adminpaneli/fakulteler/departmanekle"); // Departman ekleme sayfasına yönlendir
  };

  return (
    <div className="container mx-auto p-6">
      {/* Fakülteler Başlığı ve Fakülte Ekle Butonları */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold">Fakülteler</h2>
        <div className="flex space-x-4">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all"
            onClick={handleAddFacultyClick} // Fakülte Ekle Butonuna Tıklama
          >
            Fakülte Ekle
          </button>
          <button
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-all"
            onClick={handleAddDepartmentClick} // Departman Ekle Butonuna Tıklama
          >
            Departman Ekle
          </button>
        </div>
      </div>

      {/* Fakülteler Listesi */}
      <div className="space-y-6">
        {faculties.map((faculty) => (
          <div key={faculty._id}>
            <div
              className="bg-gray-700 text-white p-4 rounded-lg cursor-pointer shadow-md hover:bg-gray-600 transition-all"
              onClick={() => handleFacultyClick(faculty._id)}
            >
              <h3 className="text-xl font-semibold">{faculty.name}</h3>
            </div>

            {/* Departmanlar sadece fakülte tıklandığında görünsün */}
            {selectedFaculty === faculty._id && (
              <div className="mt-4 space-y-2">
                {departments.map(
                  (department) =>
                    department.faculty._id === faculty._id && (
                      <div
                        key={department._id}
                        className="bg-gray-300 p-3 rounded-md shadow-md hover:bg-gray-200 transition-all"
                      >
                        {department.name}
                      </div>
                    )
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faculties;
