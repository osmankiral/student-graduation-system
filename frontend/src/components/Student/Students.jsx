import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const Students = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10); // Her sayfada 10 öğrenci göster

  const navigate = useNavigate();

  // JWT tokenini localStorage'dan çek
  const token = localStorage.getItem("token");

  // Verileri API'den çek
  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setStudents(response.data); // Eğer verilerin farklı bir yapısı varsa buna göre uyarlayın
    } catch (error) {
      console.error("Veriler çekilemedi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mezun ve mezun olmayan öğrenci sayısını hesapla
  const graduatedCount = students.filter((s) => s.isGraduated).length;
  const notGraduatedCount = students.length - graduatedCount;

  // Mezuniyet yılına göre bar chart verisi
  const graduatedStudents = students.filter((s) => s.isGraduated);
  const graduationYears = graduatedStudents.map(
    (student) => student.graduationYear
  );

  const graduationYearCounts = graduationYears.reduce((acc, year) => {
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});

  const barData = {
    labels: Object.keys(graduationYearCounts),
    datasets: [
      {
        label: "Mezuniyet Yılına Göre Öğrenci Sayısı",
        data: Object.values(graduationYearCounts),
        backgroundColor: "#4CAF50", // Bar renkleri
        borderColor: "#388E3C",
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ["Mezun", "Henüz Mezun Olmadı"],
    datasets: [
      {
        data: [graduatedCount, notGraduatedCount],
        backgroundColor: ["#4CAF50", "#FF5722"], // Mezun ve mezun olmayan renkleri
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  // Sayfa yüklendiğinde fetchStudents'ı çağır
  useEffect(() => {
    fetchStudents();
  }, []);

  // Arama işlemi
  const filteredStudents = students.filter((student) => {
    const searchTermLower = searchTerm.toLowerCase();
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    return (
      fullName.includes(searchTermLower) || // Ad ve soyadı birleştirip arama
      student.faculty.name.toLowerCase().includes(searchTermLower) ||
      student.department.name.toLowerCase().includes(searchTermLower) ||
      student.graduationYear?.toString().includes(searchTerm)
    );
  });

  // Sayfalama için öğrenci listesi
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  // Sayfa değiştirici
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Excel'e verileri aktarma fonksiyonu
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      students.map((student) => ({
        Ad: student.firstName,
        Soyad: student.lastName,
        Fakülte: student.faculty.name,
        Bölüm: student.department.name,
        MezuniyetDurumu: student.isGraduated ? "Mezun" : "Henüz Mezun Olmadı",
        MezuniyetYılı: student.graduationYear || "----",
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Öğrenciler");
    XLSX.writeFile(wb, "ogrenciler.xlsx");
  };

  // Güncelle ve Sil işlemleri için fonksiyonlar
  const handleUpdate = (id) => {
    console.log(`Güncellenecek öğrenci ID: ${id}`);
    navigate(`./${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu öğrenciyi silmek istediğinizden emin misiniz?")) {
      try {
        await axios.delete(`http://localhost:5000/api/students/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Öğrenci başarıyla silindi.");
        fetchStudents(); // Verileri güncelle
      } catch (error) {
        console.error("Öğrenci silinemedi:", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-3">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-center">Öğrenciler</h2>

        {/* Öğrenci Ekle Butonu */}
        <button
          onClick={() => navigate("/adminpaneli/ogrenciler/ekle")}
          className="px-6 py-2 bg-blue-500 text-white rounded-md"
        >
          Öğrenci Ekle
        </button>
      </div>

      {/* Arama Alanı */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Öğrenci ara..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="text-center">Yükleniyor...</div>
      ) : (
        <>
          {currentStudents.length > 0 ? (
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full table-auto border-2 border-gray-300">
                <thead className="bg-gray-200 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      Ad
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      Soyad
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      Fakülte
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      Bölüm
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      Mezuniyet Durumu
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      Mezuniyet Yılı
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentStudents.map((student) => (
                    <tr key={student._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-700">
                        {student.firstName}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {student.lastName}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {student.faculty.name}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {student.department.name}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {student.isGraduated ? "Mezun" : "Henüz Mezun Olmadı"}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {student.graduationYear || "----"}
                      </td>
                      <td className="px-6 py-4 flex space-x-2">
                        <button
                          onClick={() => handleUpdate(student._id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-md"
                        >
                          Güncelle
                        </button>
                        <button
                          onClick={() => handleDelete(student._id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-md"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-500">Öğrenci bulunamadı.</div>
          )}
          <div className="mb-4 mt-3 text-right">
            <button
              onClick={exportToExcel}
              className="px-6 py-2 bg-blue-500 text-white rounded-md"
            >
              Excel'e Aktar
            </button>
          </div>
          {/* Sayfalama */}
          <div className="mb-6 flex justify-center">
            <nav>
              <ul className="flex space-x-2">
                {Array.from(
                  {
                    length: Math.ceil(
                      filteredStudents.length / studentsPerPage
                    ),
                  },
                  (_, index) => (
                    <li key={index + 1}>
                      <button
                        onClick={() => paginate(index + 1)}
                        className={`px-4 py-2 border border-gray-300 rounded-md ${
                          currentPage === index + 1 ? "bg-gray-300" : ""
                        }`}
                      >
                        {index + 1}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </nav>
          </div>
          <hr className="mb-6" />
          <div className="grid grid-cols-12">
            <div className="col-span-6 mx-auto">
              <div className="my-6 ">
                <h3 className="text-xl font-semibold text-center mb-4">
                  Mezuniyet Durumu Dağılımı
                </h3>
                <Pie data={pieData} options={pieOptions} />
              </div>{" "}
            </div>
            <div className="col-span-6 mx-auto">
              <div className="my-6">
                <h3 className="text-2xl font-semibold text-center mb-4">
                  Mezuniyet Yılına Göre Öğrenci Sayısı
                </h3>
                <Bar data={barData} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Students;
