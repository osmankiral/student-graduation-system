import { useState, useEffect } from "react";
import axios from "axios";

const AdminHome = () => {
  const [departmentsCount, setDepartmentsCount] = useState(0);
  const [facultiesCount, setFacultiesCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const [departmentStudentCounts, setDepartmentStudentCounts] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const token = localStorage.getItem("token"); // Token'ı localStorage'dan alıyoruz

  // Verileri API'den alıyoruz
  useEffect(() => {
    // Fakülteler sayısını al
    const fetchFacultiesCount = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/faculties", {
          headers: { Authorization: `Bearer ${token}` }, // Token'ı başlık olarak ekle
        });
        setFacultiesCount(response.data.length);
      } catch (error) {
        setErrorMessage("Fakülteler alınırken bir hata oluştu.");
      }
    };

    // Departmanlar sayısını al
    const fetchDepartmentsCount = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/departments/", {
          headers: { Authorization: `Bearer ${token}` }, // Token'ı başlık olarak ekle
        });
        setDepartmentsCount(response.data.length);
      } catch (error) {
        setErrorMessage("Departmanlar alınırken bir hata oluştu.");
      }
    };

    // Öğrenciler sayısını al ve her departman için öğrenci sayısını hesapla
    const fetchStudentsData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/students/", {
          headers: { Authorization: `Bearer ${token}` }, // Token'ı başlık olarak ekle
        });

        const students = response.data;
        setStudentsCount(students.length);

        // Departman bazında öğrenci sayısını hesapla
        const studentCountsByDepartment = students.reduce((acc, student) => {
          const departmentName = student.department.name;
          if (acc[departmentName]) {
            acc[departmentName]++;
          } else {
            acc[departmentName] = 1;
          }
          return acc;
        }, {});

        setDepartmentStudentCounts(studentCountsByDepartment);
      } catch (error) {
        setErrorMessage("Öğrenciler alınırken bir hata oluştu.");
      }
    };

    // API çağrılarını başlatıyoruz
    fetchFacultiesCount();
    fetchDepartmentsCount();
    fetchStudentsData();
  }, [token]); // Token değişirse yeniden istek atmak için token'ı dependency olarak ekledik


  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">İstatistikler</h1>

      {/* Hata mesajı */}
      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Fakülte Sayısı */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:bg-gray-100 transition-all">
          <h3 className="text-xl font-semibold text-gray-800">Fakülteler</h3>
          <p className="text-4xl font-bold text-blue-500">{facultiesCount}</p>
        </div>

        {/* Departman Sayısı */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:bg-gray-100 transition-all">
          <h3 className="text-xl font-semibold text-gray-800">Departmanlar</h3>
          <p className="text-4xl font-bold text-green-500">{departmentsCount}</p>
        </div>

        {/* Öğrenci Sayısı */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:bg-gray-100 transition-all">
          <h3 className="text-xl font-semibold text-gray-800">Öğrenciler</h3>
          <p className="text-4xl font-bold text-purple-500">{studentsCount}</p>
        </div>
      </div>

      {/* Departmanlardaki Öğrenci Sayıları */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Departmanlardaki Öğrenciler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Object.keys(departmentStudentCounts).map((department, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:bg-gray-100 transition-all"
            >
              <h3 className="text-xl font-semibold text-gray-800">{department}</h3>
              <p className="text-4xl font-bold text-yellow-500">
                {departmentStudentCounts[department]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
