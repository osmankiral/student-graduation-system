import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // Hata mesajı için
  const navigate = useNavigate(); // Yönlendirme işlemi için

  // Sayfa yüklendiğinde localStorage'da token var mı kontrol et
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Eğer token varsa, admin paneline yönlendir
      navigate("/adminpaneli/anasayfa");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault(); // Sayfanın yeniden yüklenmesini engeller
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });

      // JWT Token'i localStorage'a kaydet
      const token = response.data.token; // Sunucudan dönen token (response'daki key'e göre değişebilir)
      localStorage.setItem("token", token);
      console.log("JWT Token:", token);

      // Başarılı girişte yönlendirme
      navigate("/adminpaneli/anasayfa");
    } catch (err) {
      console.error("Giriş Hatası:", err);
      setError("Kullanıcı adı veya şifre hatalı."); // Hata durumunda mesaj
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Giriş Yap
        </h2>
        <form onSubmit={handleLogin}>
          {/* Kullanıcı Adı */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Kullanıcı adını güncelle
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Kullanıcı adınızı giriniz"
            />
          </div>

          {/* Şifre */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Şifre
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Şifreyi güncelle
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Şifrenizi giriniz"
            />
          </div>

          {/* Hata Mesajı */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Giriş Butonu */}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Giriş Yap
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
