import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Outlet } from "react-router-dom";
import Dashboard from "../components/DashboardLayout/Dashboard";
import Sidebar from "../components/DashboardLayout/Sidebar";

const AdminDashBoard = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Oturum açmanız gerekiyor!");
      navigate("/"); // Giriş sayfasına yönlendirme
    } else {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Mevcut zaman (saniye)
        if (decoded.exp < currentTime) {
          alert("Oturum süresi dolmuş, lütfen yeniden giriş yapın.");
          localStorage.removeItem("token");
          navigate("/"); // Token süresi dolmuşsa yönlendirme
        }
      } catch (err) {
        console.error("Token doğrulama hatası:", err);
        localStorage.removeItem("token");
        navigate("/"); // Token hatası varsa yönlendirme
      }
    }
  }, [navigate]);

  return (
    <>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className=" bg-gray-800 text-white">
          <Sidebar sidebarToggle={sidebarToggle} />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col bg-gray-100">
          {/* Dashboard */}
          <div className="flex-none">
            <Dashboard
              sidebarToggle={sidebarToggle}
              setSidebarToggle={setSidebarToggle}
            />
          </div>

          {/* Outlet (Students component) */}
          <div className="flex-1 p-4 ml-64 overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};
export default AdminDashBoard;
