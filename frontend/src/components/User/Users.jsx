import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10); // Her sayfada 10 kullanıcı göster

  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // JWT token

  // Kullanıcıları API'den çek
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Kullanıcı verileri alınamadı:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sayfa yüklendiğinde kullanıcıları çek
  useEffect(() => {
    fetchUsers();
  }, []);

  // Arama işlemi
  const filteredUsers = users.filter((user) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      user.username.toLowerCase().includes(searchTermLower) ||
      user.role.toLowerCase().includes(searchTermLower)
    );
  });

  // Sayfalama işlemi
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Sayfa değiştirici
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Kullanıcı ekleme
  const handleAddUser = () => {
    navigate("/adminpaneli/kullanicilar/ekle");
  };

  // Kullanıcı güncelleme
  const handleUpdate = (id) => {
    console.log(`Güncellenecek kullanıcı ID: ${id}`);
    navigate(`/adminpaneli/kullanicilar/${id}`);
  };

  // Kullanıcı silme
  const handleDelete = async (id) => {
    if (window.confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Kullanıcı başarıyla silindi.");
        fetchUsers(); // Listeyi güncelle
      } catch (error) {
        console.error("Kullanıcı silinemedi:", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-3">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-center">Kullanıcılar</h2>

        {/* Kullanıcı Ekle Butonu */}
        <button
          onClick={handleAddUser}
          className="px-6 py-2 bg-blue-500 text-white rounded-md"
        >
          Kullanıcı Ekle
        </button>
      </div>

      {/* Arama Alanı */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Kullanıcı ara..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="text-center">Yükleniyor...</div>
      ) : (
        <>
          {currentUsers.length > 0 ? (
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full table-auto border-2 border-gray-300">
                <thead className="bg-gray-200 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      Kullanıcı Adı
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-700">{user.username}</td>
                      <td className="px-6 py-4 text-gray-700">{user.role}</td>
                      <td className="px-6 py-4 flex space-x-2">
                        <button
                          onClick={() => handleUpdate(user._id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-md"
                        >
                          Güncelle
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
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
            <div className="text-center text-gray-500">
              Kullanıcı bulunamadı.
            </div>
          )}

          {/* Sayfalama */}
          <div className="mt-4 flex justify-center">
            <nav>
              <ul className="flex space-x-2">
                {Array.from(
                  { length: Math.ceil(filteredUsers.length / usersPerPage) },
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
        </>
      )}
    </div>
  );
};

export default Users;
