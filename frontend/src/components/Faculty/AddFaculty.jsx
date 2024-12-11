import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddFaculty = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", // Fakülte adı
  });
  const [errorMessage, setErrorMessage] = useState(""); // Hata mesajı state'i
  const token = localStorage.getItem("token");

  // Form verisi değişimlerini takip et
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrorMessage(""); // Formda bir değişiklik olduğunda hata mesajını temizle
  };

  // Fakülte ekleme isteği
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/faculties", // Fakülteyi eklemek için API endpoint
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Fakülte başarıyla eklendi!");
      navigate("/adminpaneli/fakulteler"); // Fakülteler sayfasına yönlendir
    } catch (error) {
      console.error("Ekleme başarısız:", error);
      if (error.response && error.response.data.message) {
        // Eğer backend'den bir hata mesajı geldiyse, bu mesajı alıp state'e aktaralım
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">Fakülte Ekle</h2>
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
            Fakülte Adı
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

export default AddFaculty;
