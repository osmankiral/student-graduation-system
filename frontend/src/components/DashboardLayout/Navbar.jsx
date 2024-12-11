import { FaBars, FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = ({ sidebarToggle, setSidebarToggle }) => {
  const token = localStorage.getItem("token");
  let user = null;
  const navigate = useNavigate();
  if (token) {
    user = jwtDecode(token); // Kullanıcı bilgilerini çözümle
  }
  const [menuOpen, setMenuOpen] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("token"); // Token'i sil
    navigate("/"); // Giriş sayfasına yönlendir
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // Menü durumunu değiştir
  };

  return (
    <nav className="bg-gray-800 px-4 py-3 flex justify-between ">
      <div className="flex items-center text-xl">
        <FaBars
          className="text-white me-5 cursor-pointer"
          onClick={() => setSidebarToggle(!sidebarToggle)}
        />
        <span className="text-white font-semibold">Admin Paneli</span>
      </div>
      <div className="flex items-center gap-x-5">
        <div className="relative md:w-65">
          <span className="relative md:absolute inset-y-0 left-0 flex items-center pl-2">
            <button className="p-1 focus:outline-none text-white md:text-black">
              <FaSearch />
            </button>
          </span>
          <input
            className="w-full px-4 py-1 pl-12 rounded outline-none hidden md:block"
            type="text"
          />
        </div>
        <div className="text-white">
          <FaBell className="w-6 h-6" />
        </div>
        <div className="relative">
          <button className="text-white group relative" onClick={toggleMenu}>
            <FaUserCircle className="w-6 h-6 mt-1" />
            <div
              className={`${
                menuOpen ? "block" : "hidden"
              } z-10 absolute bg-gray-800 rounded-lg shadow w-32 top-full mt-5 right-0`}
            >
              <ul className="p-1 text-md text-white divide-y">
                <li className="py-2 hover:bg-gray-700">
                  <a href="">Profil</a>
                </li>
                <li className="py-2 hover:bg-gray-700 ">
                  <a href="">Ayarlar</a>
                </li>
                <li className="py-2 hover:bg-gray-700">
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false); // Çıkış yaparken menüyü kapat
                    }}
                    className=""
                  >
                    Çıkış
                  </button>
                </li>
              </ul>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
